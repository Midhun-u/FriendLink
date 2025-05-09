import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getAddedUser } from "../api/messageApi";
import { useInView } from "react-intersection-observer";
import Loader from "../components/Loader";
import MessageScreen from "../components/MessageScreen";
import { profileApi } from "../api/authApi";
import AddedUsers from "../components/AddedUsers";
import SearchUsers from "../components/SearchUsers";
import {io} from 'socket.io-client'
import {useSelector} from 'react-redux'

const socket = io(import.meta.env.VITE_SOCKET_CONNECTION_URL)

const Home = () => {
  
  const {theme} = useSelector(state => state.theme)
  const [messageScreen, setMessageScreen] = useState(false);
  const [addedUsers, setAddedUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchScreen , setSearchScreen] = useState(false)
  const [receiver, setReceiver] = useState();
  const [userProfile, setUserProfile] = useState();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [onlineUsers , setOnlineUsers] = useState([])
  const [blockedUsers , setBlockedUsers] = useState([])
  const { inView, ref } = useInView()
  
  //function for get added user
  const getUsers = async () => {
    try {
      const result = await getAddedUser(page);

      if (result.success) {
        setAddedUsers((pre) => [...pre, ...result.addedUsers]);
        setTotalCount(result.totalCount);
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
  }

  //function for get profile
  const getProfile = async () => {
    try {
      const result = await profileApi();

      if (result.success) {

        setUserProfile(result.profile)
        setBlockedUsers(result.profile.blockedUsers)

        //send user id
        socket.emit("online-users" , result.profile._id)

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

    getProfile()

  }, [])

  useEffect(() => {

    getUsers()

  } , [page])

  useEffect(() => {

    if(inView && addedUsers.length < totalCount){

      setPage(pre => pre + 1)

    }

  }, [inView])

  useEffect(() => {
    if (sessionStorage.length) {
      setReceiver(JSON.parse(sessionStorage.getItem("person")));
      setMessageScreen(true);
      sessionStorage.clear();
    }
  }, [])

  useEffect(() => {

    const handleGetOnlineUsers = () => {

      socket.on("get-online-users" , (onlineUsers) => {
        setOnlineUsers(() => [...onlineUsers])
      })

    }

    handleGetOnlineUsers()

    return () => socket.off("get-online-users" , handleGetOnlineUsers)

  } , [])

  //function for search added user
  const handleSeachAddedUsers = (personName) => {
    if (personName.trim()) {
      const filteredAddedUsers = addedUsers.filter((addedUser) =>
        addedUser.fullName.includes(personName.trim())
      );
      setSearchUsers(filteredAddedUsers);
      
      if(filteredAddedUsers.length > 0) setSearchScreen(true)
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <div className="w-full h-screen grid xl:grid-cols-[500px_1fr] lg:grid-cols-[350px_1fr]">
        <div className={`w-full h-full overflow-y-scroll overflow-x-hidden ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"}`}>
          <div className="w-full h-20 p-4 lg:p-10 flex flex-col gap-7">
            <h1 className={`lg:text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>
              Chats(<span className="text-primary">{addedUsers.length}</span>)
            </h1>
            <div className="w-full h-auto flex items-center relative">
              <input
                onChange={(event) => handleSeachAddedUsers(event.target.value)}
                className={`w-full h-10  lg:h-10  focus:border-1 border-primary outline-none pl-10 pr-5 ${theme === "dark" ? "bg-blackForeground placeholder-white text-white" : "bg-white placeholder-black text-black"} rounded-md `}
                type="text"
                placeholder="Search"
              />
              <img
                className="absolute w-4 h-4 lg:w-6 lg:h-6 left-2"
                src={assets.searchIcon}
                alt=""
              />
            </div>
          </div>
          <div className="mt-15 lg:mt-30 flex flex-col items-center justify-start gap-2 px-2 md:px-5 w-full">
            {!searchScreen ? (
              <AddedUsers
                addedUsers={addedUsers}
                setReceiver={setReceiver}
                setMessageScreen={setMessageScreen}
                userProfile={userProfile}
                onlineUsers={onlineUsers}
                blockedUsers={blockedUsers}
                totalCount={totalCount}
                ref={ref}
              />
            ) : (
              <SearchUsers
                searchUsers={searchUsers}
                setMessageScreen={setMessageScreen}
                setReceiver={setReceiver}
                userProfile={userProfile}
                onlineUsers={onlineUsers}
                blockedUsers={blockedUsers}
                
              />
            )}
            {addedUsers.length < totalCount ? (
              <div ref={ref} className="w-full h-auto">
                <Loader />
              </div>
            ) : null}
          </div>
        </div>
        {messageScreen ? (
          <MessageScreen
            userProfile={userProfile}
            receiver={receiver}
            setReceiver={setReceiver}
            setMessageScreen={setMessageScreen}
            socket={socket}
            onlineUsers={onlineUsers}
            blockedUsers={blockedUsers}
            setBlockedUsers={setBlockedUsers}
          />
        ) : (
          <div className={`hidden lg:grid w-full h-full ${theme === "dark" ? "bg-blackForeground" : "bg-white"} place-items-center`}>
            <div className="flex flex-col items-center">
              <img
                className="w-40 h-40 xl:w-50 xl:h-50 "
                src={assets.chatIcon}
                alt=""
              />
              <p className={`mt-3 lg:text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>
                You’ve found your place. Let’s get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;