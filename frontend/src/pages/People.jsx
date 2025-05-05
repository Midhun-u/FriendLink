import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { getPeople, sendRequest } from "../api/peopleApi";
import { useSelector, useDispatch } from "react-redux";
import { fetchPeople, failRequest, request } from "../store/peopleSlice";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import { useInView } from "react-intersection-observer";
import { profileApi } from "../api/authApi";
import ViewProfile from "../components/ViewProfile";

const People = () => {
  
  const [page, setPage] = useState(1);
  const [peopleArr, setPeopleArr] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { loading, people } = useSelector((state) => state.people);
  const {theme} = useSelector(state => state.theme)
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [profileScreen , setProfileScreen] = useState(false)
  const [person , setPerson] = useState()

  //function for getUser requested users
  const getUser = async () => {
    try {
      const result = await profileApi();
      setRequestedUsers(result.profile.requestedUsers);
      setAddedUsers(result.profile.addedUsers);
    } catch (error) {
      const errorMessage = error?.response.data
            
      if (errorMessage.auth === false) {
          navigate("/login")
      } else if (errorMessage.message) {
            toast.error(errorMessage.message)
      } else {
            toast.error("Something went wrong");
      }
    }
  };

  //function for getting all users
  const handleGetPeople = async () => {
    dispatch(request());

    try {
      const result = await getPeople(page);

      if (result.success) {
        const newPeopleArr = [...peopleArr, ...result.people];
        setPeopleArr(newPeopleArr);
        dispatch(fetchPeople(newPeopleArr));

        if (
          newPeopleArr.length >= result.totalCount ||
          result.people.length === 0
        ) {
          setHasMore(false);
        }
      }
    } catch (error) {
      const errorMessage = error?.response.data
            
      if (errorMessage.auth === false) {
          navigate("/login")
      } else if (errorMessage.message) {
            toast.error(errorMessage.message)
      } else {
            toast.error("Something went wrong");
      }

      dispatch(failRequest(error));
    }
  };

  //function for send request
  const handleSendRequest = async (personId) => {
    try {
      if (personId) {
        const result = await sendRequest(personId);

        if (result.success) {
          toast.success(result.message);
          setRequestedUsers([...requestedUsers, personId])
        }
      }
    } catch (error) {
      const errorMessage = error?.response.data
            
      if (errorMessage.auth === false) {
          navigate("/login")
      } else if (errorMessage.message) {
            toast.error(errorMessage.message)
      } else {
            toast.error("Something went wrong");
      }
    }
  };

  //function for seach user
  const handleSeachPeople = (personName) => {
    personName = personName.trim();

    if (personName) {
      const filterPeople = peopleArr.filter((person) =>
        person.fullName.includes(personName)
      );
      dispatch(fetchPeople(filterPeople));
    } else {
      dispatch(fetchPeople(peopleArr));
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    //check availability of more data
    if (hasMore) {
      handleGetPeople();
    }
  }, [page]);

  //when loading appear change page count
  useEffect(() => {
    if (inView) {
      setPage((prePage) => prePage + 1);
    }
  }, [inView]);

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row overflow-hidden relative">
      <Sidebar />
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          {
            profileScreen
            ?
            <div className={`w-screen h-screen ${theme === "dark" ? "bg-blackBackground/55" : "bg-white/55"} absolute z-10 flex justify-center items-center`}>
              <ViewProfile person={person} setProfileScreen={setProfileScreen} setRequestedUsers={setRequestedUsers} requestedUsers={requestedUsers} />
            </div>
            :
            null
          }
        <div className={`w-full h-full px-5 overflow-y-scroll ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"}`}>
          <div className="w-full h-40 flex flex-col items-start justify-center gap-6">
            <h1 className={`lg:text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>People</h1>
            <div className="relative lg:w-[50%] md:w-[70%] w-full flex items-center">
              <input
                onChange={(event) => handleSeachPeople(event.target.value)}
                className={`lg:w-full lg:h-auto md:w-full w-full py-2 rounded-sm pr-5 pl-10 outline-none ${theme === "dark" ? "bg-blackForeground placeholder-white text-white" : "bg-white placeholder-black text-black"}`}
                type="text"
                placeholder="Search friends"
              />
              <img
                className="w-5 h-5 absolute left-2"
                src={assets.searchIcon}
                alt=""
              />
            </div>
          </div>
          <div className="w-full h-auto justify-center md:justify-start overflow-y-scroll flex flex-wrap gap-x-3 gap-y-3">
            {people?.map((person, index) => (
              <div
                className={`w-35 cursor-pointer min-h-20 lg:w-50 ${theme === "dark" ? "bg-blackForeground" : "bg-white"} rounded-lg flex justify-start py-5 flex-col items-center px-2 relative gap-5`}
                key={index}
                onClick={() => {
                  setPerson(person)
                  setProfileScreen(true)
                }}
              >
                <div>
                  {person.profilePic ? (
                    <img
                      className="w-15 h-15 rounded-full"
                      src={person.profilePic}
                      alt=""
                    />
                  ) : person.gender === "Male" ? (
                    <img
                      className="w-15 h-15 rounded-full"
                      src={assets.maleGenderIcon}
                      alt=""
                    />
                  ) : person.gender === "Female" ? (
                    <img
                      className="w-15 h-15 rounded-full"
                      src={assets.femaleGenderIcon}
                      alt=""
                    />
                  ) : (
                    <img
                      className="w-15 h-15 rounded-full "
                      src={assets.nullProfilePic}
                      alt=""
                    />
                  )}
                </div>
                <div className="flex flex-col w-full items-center overflow-hidden">
                  <span className={`w-full text-center overflow-hidden ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {person.fullName}
                  </span>
                  <span className="text-sm text-gray-600 text-center w-full max-h-30 overflow-hidden">
                    {person.bio}
                  </span>
                </div>
                <div className="w-full flex justify-center px-2">
                  {requestedUsers.includes(person._id) ? (
                    <button className={`flex mt-2 ${!person.bio ? "mt-0 bottom-5 w-[80%] absolute" : "w-full"} justify-center cursor-pointer items-center ${theme === "dark" ? "bg-blackBackground" : "bg-gray-50"} h-auto py-2 gap-2`}
                    >
                      <img
                        className="w-5 h-5 lg:w-6 lg:h-6"
                        src={assets.doneIcon}
                        alt=""
                      />
                      <span className={`text-sm font-normal ${theme === "dark" ? "text-white" : "text-black"}`}>Request sent</span>
                    </button>
                  ) : addedUsers.includes(person._id) ? (
                    <button
                      onClick={() => {
                        sessionStorage.setItem(
                          "person",
                          JSON.stringify(person)
                        );
                        navigate("/");
                      }}
                      className={`flex mt-2 justify-center ${!person.bio ? "absolute bottom-5 w-[90%]" : "w-full"} items-center cursor-pointer ${theme === "dark" ? "bg-blackBackground" : "bg-gray-50"} h-auto py-1 gap-2`}
                    >
                      <img
                        className="w-5 h-5 lg:w-8 lg:h-8"
                        src={assets.messageIcon}
                        alt=""
                      />
                      <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Message</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(person._id, person)}
                      className={`flex mt-2 ${!person.bio ? "absolute bottom-5 mt-0 w-[80%]" : "w-[95%]"} justify-center cursor-pointer items-center ${theme === "dark" ? "text-white bg-blackBackground" : 'text-black bg-gray-50'} h-auto py-1 gap-2`}
                    >
                      <img
                        className="w-5 h-5 lg:w-8 lg:h-8 "
                        src={assets.addPeopleIcon}
                        alt=""
                      />
                      <span className={`text-sm font-normal ${theme === "dark" ? "text-white" : "text-black"}`}>Add</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {hasMore && (
              <div
                ref={ref}
                className="relative w-full flex justify-center items-center overflow-hidden"
              >
                <Loader />
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default People;
