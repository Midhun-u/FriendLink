import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { changeProfileApi, profileApi } from "../api/authApi";
import { authRequest, authFail, authSuccess } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router"

const Profile = () => {

  const [editProfile, setEditProfile] = useState(false);
  const dispatch = useDispatch();
  const { loading, userData } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    bio: "",
    gender: "",
    profilePic: "",
  });
  const imageRef = useRef();
  const navigate = useNavigate()
  const {theme} = useSelector(state => state.theme)

  //function for get profile
  const handleGetProfile = async () => {
    try {
      dispatch(authRequest());

      const result = await profileApi();

      if (result.success) {
        dispatch(authSuccess(result.profile));
        setUserDetails({
          ...userDetails,
          fullName: result.profile.fullName,
          bio: result.profile.bio,
          gender: result.profile.gender,
          profilePic: result.profile.profilePic,
        });
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

      dispatch(authFail());
    }
  };

  //function for changing user profile
  const handleChangeProfile = async () => {
    try {
      const result = await changeProfileApi(
        userDetails.fullName,
        userDetails.profilePic,
        userDetails.gender,
        userDetails.bio
      );

      if (result.success) {
        toast.success(result.message);
        setEditProfile(false);
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

  //function for change profile pic
  const handleChangeProfilePic = async (file) => {

    try {
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setUserDetails({ ...userDetails, profilePic: reader.result });
        };
      } else {
        toast.error("Unsupported file");
      }
    } catch (error) {
      setUserDetails({ ...userDetails, profilePic: userData.profilePic });
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <div className="flex w-screen h-screen lg:flex-row flex-col overflow-hidden">
      <Sidebar />
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className={`w-full h-full py-10 px-2 lg:p-10 ${theme === "dark" ? "bg-blackBackground text-black" : "bg-gray-100 text-white"} overflow-y-scroll flex flex-col justify-center lg:items-start items-center gap-5`}>
            <input
              onChange={(event) =>
                handleChangeProfilePic(event.target.files[0])
              }
              ref={imageRef}
              type="file"
              hidden
            />
          {userData.profilePic ? (
            editProfile ? (
              <div>
                <img
                  onClick={() => imageRef.current?.click()}
                  className="w-40 h-40 rounded-full cursor-pointer"
                  src={userDetails.profilePic}
                  alt=""
                />
              </div>
            ) : <img className="w-40 h-40 rounded-full cursor-pointer"  src={userData.profilePic} />
          ) : editProfile ? (
            <img
              className="w-40 h-40 rounded-full cursor-pointer"
              src={userData.gender === "Male" ? assets.maleGenderIcon : (userData.gender === "Female" ? assets.femaleGenderIcon : assets.nullProfilePic)}
              alt=""
              onClick={() => imageRef.current?.click()}
            />
          ) : (
            (
              userDetails.profilePic
              ?
              <img onClick={() => imageRef.current?.click()} className="w-40  h-40 rouned-full cursor-pointer" src={userDetails.profilePic} alt="" />
              :
              <img
                className="w-40 h-40 rounded-full cursor-pointer"
                src={userData.gender === "Male" ? assets.maleGenderIcon : (userData.gender === "Female" ? assets.femaleGenderIcon : assets.nullProfilePic)}
                alt=""
              />
            )
          )}
          {editProfile ? (
            <input
              onChange={(event) =>
                setUserDetails({ ...userDetails, fullName: event.target.value })
              }
              className={`lg:w-[40%] md:w-[60%] w-full py-2 border-2 rounded-md outline-none px-3 ${theme === "dark" ? "bg-blackForeground text-white" : "bg-white text-black"}`}
              type="text"
              placeholder="Enter your name"
              defaultValue={userData.fullName}
            />
          ) : (
            <h1 className={`lg:text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>{userData?.fullName}</h1>
          )}
          {editProfile ? (
            <textarea
              onChange={(event) =>
                setUserDetails({ ...userDetails, bio: event.target.value })
              }
              defaultValue={userData.bio}
              className={`border-2 lg:w-[40%] md:w-[60%] w-full py-2 h-30 resize-none rounded-md outline-none px-3 ${theme === "dark" ? "bg-blackForeground text-white" : ""}`}
              placeholder="Enter you new bio"
            />
          ) : (
            <p className={`lg:max-w-[40%] md:w-[80%] w-[95%] ${theme === "dark" ? "text-white" : 'text-black'}`}>{userData?.bio}</p>
          )}
          {editProfile ? (
            <div className="lg:w-[40%] flex gap-3">
              <span className={theme === "dark" ? "text-white" : ""}>Gender : </span>
              <select
                onChange={(event) =>
                  setUserDetails({ ...userDetails, gender: event.target.value })
                }
                defaultValue={userData.gender}
                className={`${theme === "dark" ? "text-white bg-blackBackground" : 'text-black'}`}
              >
                <option className={theme === "dark" ? "text-white" : ""} value="select">Select</option>
                <option className={theme === "dark" ? "text-white" : ""} value="Male">Male</option>
                <option className={theme === "dark" ? "text-white" : ""} value="Female">Female</option>
              </select>
            </div>
          ) : (
            <span className={`${theme === "dark" ? 'text-white' : "text-black"}`}>Gender : {userData?.gender ? userData.gender : "None"}</span>
          )}
          {editProfile ? (
            <div className="w-full flex gap-3">
              <button
                onClick={() => setEditProfile(false)}
                className={`lg:w-[20%] md:w-[60%] w-full py-2 ${theme === "dark" ? "text-white bg-blackForeground" : "bg-white text-black"} rounded-md cursor-pointer`}
              >
                Cancel changes
              </button>
              <button
                onClick={handleChangeProfile}
                className="lg:w-[20%] md:w-[60%] w-full py-2 bg-secondary text-white rounded-md cursor-pointer "
              >
                Save changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditProfile(true)}
              className="lg:w-[20%] md:w-[30%] w-[70%] py-2 bg-secondary text-white rounded-md cursor-pointer"
            >
              Edit profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
