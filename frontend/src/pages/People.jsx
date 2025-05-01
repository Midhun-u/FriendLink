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

const People = () => {
  
  const [page, setPage] = useState(1);
  const [peopleArr, setPeopleArr] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { loading, people } = useSelector((state) => state.people);
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);

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
    <div className="w-screen h-screen flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full h-full px-5 overflow-y-scroll bg-gray-100">
          <div className="w-full h-40 flex flex-col items-start justify-center gap-6">
            <h1 className="lg:text-xl">People</h1>
            <div className="relative lg:w-[50%] md:w-[70%] w-full flex items-center">
              <input
                onChange={(event) => handleSeachPeople(event.target.value)}
                className="lg:w-full lg:h-auto md:w-full w-full py-2 rounded-sm pr-5 pl-10 outline-none bg-white"
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
                className="w-35 cursor-pointer min-h-20 lg:w-50 bg-white rounded-lg flex justify-start py-5 flex-col items-center px-2 relative gap-5"
                key={index}
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
                  <span className="w-full text-center overflow-hidden">
                    {person.fullName}
                  </span>
                  <span className="text-sm text-gray-600 text-center w-full max-h-30 overflow-hidden">
                    {person.bio}
                  </span>
                </div>
                <div className="w-full flex justify-center px-2">
                  {requestedUsers.includes(person._id) ? (
                    <button className="flex mt-2 justify-center cursor-pointer items-center bg-gray-50 w-full h-auto py-1 gap-2">
                      <img
                        className="w-5 h-5 lg:w-6 lg:h-6"
                        src={assets.doneIcon}
                        alt=""
                      />
                      <span className="text-sm font-normal">Request sent</span>
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
                      className="flex mt-2 justify-center items-center cursor-pointer bg-gray-50 w-full h-auto py-1 gap-2"
                    >
                      <img
                        className="w-5 h-5 lg:w-8 lg:h-8"
                        src={assets.messageIcon}
                        alt=""
                      />
                      <span>Message</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(person._id, person)}
                      className="flex mt-2 justify-center cursor-pointer items-center bg-gray-50 w-[95%] h-auto py-1 gap-2"
                    >
                      <img
                        className="w-5 h-5 lg:w-8 lg:h-8 "
                        src={assets.addPeopleIcon}
                        alt=""
                      />
                      <span className="text-sm font-normal">Add</span>
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
      )}
    </div>
  );
};

export default People;
