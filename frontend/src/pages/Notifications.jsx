import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { assets } from "../assets/assets";
import {
  addUser,
  getNotification,
  ignorePeople,
  clearNotificationsApi,
} from "../api/notificationApi";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useInView } from "react-intersection-observer";
import {useNavigate} from 'react-router'
import {useSelector} from 'react-redux'

const Notifications = () => {
  
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const {theme} = useSelector(state => state.theme)
  const [deleteDetails, setDeleteDetails] = useState({
    deleteScreen: false,
    personName: "",
    index: null,
    personId: "",
  });
  const [clearNotification, setClearNotification] = useState(false);
  const { InView, ref } = useInView()
  const navigate = useNavigate()

  //function for get notification
  const handleGetNotification = async () => {
    try {
      const result = await getNotification(page);

      if (result.success) {
        setNotification((preNoti) => [...preNoti, ...result.notifications]);
        setNotificationCount(result.totalCount);
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

  useEffect(() => {
    handleGetNotification();
  }, [page]);

  useEffect(() => {
    setPage((prePage) => prePage + 1);
  }, [InView]);


  //functiong for adding user for chatting
  const handleAddUser = async (personId, index) => {
    try {
      if (personId) {
        const result = await addUser(personId, index);

        if (result.success) {
          toast.success(result.message);
          notification.splice(index, 1);

          if (notification.length === 0) {
            setNotificationCount(0);
            setNotification([]);
          } else {
            setNotificationCount(notificationCount - 1);
          }
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

  //function for ignore people
  const handleIgnore = async (index, personId) => {
    try {
      const result = await ignorePeople(index, personId);

      if (result.success) {
        toast.success(result.message);

        notification.splice(index, 1);

        if (notification.length === 0) {
          setNotificationCount(0);
        } else {
          setNotificationCount(notificationCount - 1);
        }

        setDeleteDetails({ ...deleteDetails, deleteScreen: false });
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

  //function for clear notification
  const handleClearNotification = async () => {
    try {
      const result = await clearNotificationsApi();

      if (result.success) {
        toast.success(result.message);
        setNotification([]);
        setNotificationCount(0);
        setClearNotification(false);
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

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row">
      <Sidebar />
      <div className={`w-full h-full py-5 lg:py-10 px-5 overflow-hidden relative ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"}`}>
        <div className="w-full h-auto flex items-center justify-between">
          <h1 className={`lg:text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>
            Notifications(
            <span className="text-primary">{notificationCount}</span>)
          </h1>
          {notificationCount > 0 ? (
            <button
              onClick={() => setClearNotification(true)}
              className={`flex items-center gap-3 ${theme === "dark" ? 'bg-blackForeground text-white' : "bg-white text-black"} px-3 py-2 lg:px-5 lg:py-3 cursor-pointer`}
            >
              <img
                className="w-5 h-5 lg:w-7 lg:h-7"
                src={assets.clearIcon}
                alt=""
              />
              <span className="lg:text-md">Clear</span>
            </button>
          ) : null}
        </div>
        <div className="w-full h-auto overflow-y-scroll justify-center lg:justify-start pt-5 mt-5 flex flex-wrap gap-x-3 gap-y-3">
          {notification?.map((notif, index) => (
            <div
              key={index}
              className={`w-110 md:w-100 md:h-40 ${theme === "dark" ? 'bg-blackForeground text-white' : "bg-white text-black"} flex flex-col gap-4 py-2 px-3 rounded-md lg:pt-3`}
            >
              <div className="w-full flex flex-col items-center md:flex-row lg:items-center gap-4 overflow-hidden cursor-pointer">
                {notif.person.profilePic ? (
                  <img
                    className="w-14 h-14 lg:w-17 lg:h-17 rounded-full shrink-0"
                    src={notif.person.profilePic}
                    alt=""
                  />
                ) : (
                  notif.person.gender === "Male"
                  ?
                  <img className="w-14 h-14 lg:w-17 lg:h-17 rounded-full shrink-0" src={assets.maleGenderIcon} alt="" />
                  :
                  (
                    notif.person.gender === "Female"
                    ?
                    <img className="w-14 h-14 lg:w-17 lg:h-17 rounded-full shrink-0" src={assets.femaleGenderIcon} alt="" />
                    :
                    <img
                      className="w-14 h-14 lg:w-17 lg:h-17 rounded-full shrink-0"
                      src={assets.nullProfilePic}
                      alt=""
                    />
                  )
                )}
                <span className="lg:text-lg shrink-0">{notif.message}</span>
              </div>
              <div className="flex justify-center md:justify-start gap-5">
                <button
                  onClick={() => handleAddUser(notif.person._id, index)}
                  className="px-2 py-1 lg:px-3 lg:py-1 bg-[#00BFFF] rounded text-white cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    setDeleteDetails({
                      ...deleteDetails,
                      deleteScreen: true,
                      personName: notif.person.fullName,
                      personId: notif.person._id,
                      index: index,
                    })
                  }
                  className="px-2 py-1 lg:px-3 lg:py-1 bg-red-600 rounded text-white cursor-pointer"
                >
                  Ignore
                </button>
              </div>
              {deleteDetails.deleteScreen ? (
                <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center z-8">
                  <div className={`w-[80%] md:w-[60%] h-[25%] lg:w-[30%] ${theme === "dark" ? "bg-blackForeground" : "bg-white"} flex flex-col items-center justify-center p-2 lg:p-5`}>
                    <div className="grow flex  flex-col gap-3 items-center justify-center md:flex-row md:items-center md:justify-center">
                      <img
                        className="w-6 h-6 lg:w-7 lg:h-7 "
                        src={assets.warningIcon}
                        alt=""
                      />
                      <h1 className="lg:text-lg text-center md:text-left">
                        Do you want to remove {deleteDetails.personName} request
                      </h1>
                    </div>
                    <div className="flex w-full h-auto justify-between">
                      <button
                        onClick={() =>
                          setDeleteDetails({
                            ...deleteDetails,
                            deleteScreen: false,
                          })
                        }
                        className={`md:w-30 w-20 py-1 lg:px-10 rounded-md ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"} cursor-pointer`}
                      >
                        No
                      </button>
                      <button
                        onClick={() =>
                          handleIgnore(
                            deleteDetails.index,
                            deleteDetails.personId
                          )
                        }
                        className="lg:px-10 lg:py-1 md:w-30 w-20 rounded-md bg-red-600 text-white cursor-pointer"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              ) : clearNotification ? (
                <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center z-8">
                  <div className={`w-[80%] md:w-[60%] h-[25%] lg:w-[30%] ${theme === "dark" ? "bg-blackForeground" : "bg-white"} flex flex-col items-center justify-center p-2 lg:p-5`}>
                    <div className="grow flex flex-col gap-3 items-center justify-center md:flex-row md:items-center md:justify-center">
                      <img
                        className="w-6 h-6 lg:w-7 lg:h-7"
                        src={assets.warningIcon}
                        alt=""
                      />
                      <h1 className="lg:text-lg text-center md:text-left">
                        Do you want to clear notifications
                      </h1>
                    </div>
                    <div className="flex w-full h-auto justify-between">
                      <button
                        onClick={() => setClearNotification(false)}
                        className={`md:w-30 w-20 py-1 lg:px-10 rounded-md ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"} cursor-pointer `}
                      >
                        No
                      </button>
                      <button
                        onClick={handleClearNotification}
                        className="lg:px-10 lg:py-1 md:w-30 w-20 rounded-md bg-red-600 text-white cursor-pointer"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          {notification.length < notificationCount ? (
            <div ref={ref} className="w-full">
              <Loader />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
