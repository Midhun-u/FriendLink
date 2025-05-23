import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { assets } from "../assets/assets";
import { changeCurrentPassword, logout, profileApi } from "../api/authApi"
import { toast } from 'react-toastify'
import {darkTheme , whiteTheme} from '../store/themeSlice'
import {useDispatch , useSelector} from 'react-redux'
import {useNavigate} from 'react-router'
import { getBlockedUsers, unblockUser } from "../api/peopleApi";
import {useInView} from 'react-intersection-observer'
import Loader from '../components/Loader'
import {io} from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_CONNECTION_URL)

const Settings = () => {

  const {theme} = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const [pageState, setPageState] = useState({
    passwordScreen: false,
    themeScreen: false,
    blockUsersScreen: false,
  })
  const [profile, setProfile] = useState()
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: ""
  })
  const [showPassword , setShowPassword] = useState(false)
  const [blockedUsers , setBlockedUsers] = useState([])
  const [page , setPage] = useState(1)
  const [blockedUsersCount , setBlockedUsersCount] = useState(0)
  const navigate = useNavigate()
  const {inView , ref} = useInView()


  //function for get user profile
  const getUserProfile = async () => {

    try {

      const result = await profileApi()
      setProfile(result.profile)

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

  useEffect(() => {

    getUserProfile()

  } , [])

  //function for change password
  const handleChangePassword = async () => {

    try {

      if (password.currentPassword && password.newPassword) {

        if(password.newPassword.length >= 6){

          const result = await changeCurrentPassword(password.currentPassword, password.newPassword)
          
          if(result.success){
            toast.success(result.message)
            setPageState({...pageState , passwordScreen : false})
          }

        }else{
          toast.error("Password must be atleast 6 letters or above")
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

  }

  //function for change theme
  const handleChangeTheme = () => {

    if(theme === "white"){
      dispatch(darkTheme())
    }else if(theme === "dark"){
      dispatch(whiteTheme())
    }

  }

  //function for logout
  const handleLogout = async () => {

    try{

      const result = await logout()

      if(result.success){

        socket.emit("logout" , profile._id)

        toast.success(result.message)
        navigate("/login")

      }

    }catch(error){

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

  //function for get blocked users
  const handleGetBlockedUsers = async () => {

    try{

      const result = await getBlockedUsers(page)
      
      if(result.success){

        if(page === 1){
          setBlockedUsers(result.blockedUsers)
          setBlockedUsersCount(result.blockedUsersCount)
        }else{
          setBlockedUsers(prev => [...prev , ...result.blockedUsers])
        }
      }

    }catch(error){

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

  //function for unblock user
  const handleUnblockUser = async (personId , index) => {

    try{

      const result = await unblockUser(personId)
      
      if(result.success){

        const newBlockedUsers = blockedUsers
        newBlockedUsers.splice(index , 1)
        setBlockedUsers(() => [...newBlockedUsers])

      }

    }catch(error){
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

  useEffect(() => {

    setPage(page + 1)
    handleGetBlockedUsers()

  } , [inView])

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <div className={`w-full h-full ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"} lg:p-10 p-3`}>
        <div className="w-full h-full flex justify-center overflow-y-scroll overflow-x-hidden items-center flex-col gap-1">
          <div className="lg:w-[60%] md:w-[70%] w-[95%] h-auto flex justify-center items-center relative">
            {
                pageState.blockUsersScreen || pageState.passwordScreen || pageState.themeScreen
                ?
                <img onClick={() => setPageState({ ...pageState, passwordScreen: false, themeScreen: false, blockUsersScreen: false })} className="absolute lg:w-9 lg:h-9 w-5 h-5 left-0 cursor-pointer" src={assets.backButtonIcon} alt="" />
                :
                null
            }
            <h1 className={`lg:text-xl text-lg ${theme === "dark" ? "text-white" : "text-black"}`}>Settings</h1>
          </div>
          {
              pageState.passwordScreen
              ?
              <div className={`lg:w-[60%] md:w-[70%] w-[95%] h-auto min-h-100 mt-5 py-2 lg:px-20 md:px-20 px-5 flex flex-col justify-center items-center rounded-md gap-5 ${theme === "dark" ? "bg-blackForeground" : "bg-white"}`}>
                <div className="w-full h-auto relative">
                  <input onChange={(event) => setPassword({...password, currentPassword: event.target.value })} type={showPassword ? "text" : "password"} className={`border-1 rounded-md w-full outline-none py-2 pl-3 pr-10 lg:text-md text-sm ${theme === "dark" ? "bg-blackForeground text-white" : "bg-white"}`} placeholder="Enter your current password" />
                  {
                    showPassword
                    ?
                    <img onClick={() => setShowPassword(false)} className="absolute cursor-pointer w-7 h-7 top-1.5 right-2" src={assets.disablePassword} alt="" />
                    :
                    <img onClick={() => setShowPassword(true)} className="absolute cursor-pointer w-7 h-7 top-1.5 right-2" src={assets.showPassword} alt="" />
                  }
                </div>
                <div className="w-full h-auto relative">
                  <input onChange={(event) => setPassword({...password, newPassword: event.target.value })} type={showPassword ? "text" : "password"} className={`border-1 rounded-md w-full outline-none py-2 pl-3 pr-10 lg:text-md text-sm ${theme === "dark" ? "bg-blackForeground text-white" : "bg-white"}`} placeholder="Enter your new password" />
                </div>
                <button onClick={handleChangePassword} className="bg-blue-700 text-white w-full h-13 rounded-md cursor-pointer">Change password</button>
              </div>
              :
                pageState.themeScreen
                ?
                <div className="lg:w-[60%] min-h-100 md:w-[80%] w-[95%] h-auto flex flex-col items-center justify-center gap-3">
                  <div onClick={handleChangeTheme} className={`w-full h-auto py-2 px-5 flex items-center gap-3 ${theme === "dark" ? "bg-blackForeground" : "bg-white"} cursor-pointer`}>
                    <input type="radio" name="theme" checked={theme === "white"}/>
                    <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>White</span>
                  </div>
                  <div onClick={handleChangeTheme} className={`w-full h-auto py-2 px-5 flex items-center gap-3 ${theme === "dark" ? "bg-blackForeground" : "bg-white"} cursor-pointer`}>
                    <input type="radio" name="theme" checked={theme === "dark"} />
                    <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Dark</span>
                  </div>
                </div>
                :
                pageState.blockUsersScreen
                  ?
                  <div className={`lg:w-[60%] md:w-[80%] w-[95%] h-110 mt-5 bg-inherit flex flex-col items-center overflow-x-hidden overflow-y-scroll`}>
                    {
                      blockedUsers.length
                      ?
                      blockedUsers?.map((blockedUser , index) => (

                        <>
                          <div key={index} className={`w-full h-20 relative items-center px-5 overflow-hidden ${theme === "dark" ? "bg-blackForeground text-white" : "bg-white text-black"} flex rounded-md gap-3`}>
                            <img className="w-15 h-15 rounded-full" src={blockedUser.profilePic} alt="" />
                            <span className="lg:text-lg md:text-md text-sm">{blockedUser.fullName}</span>
                            <button onClick={() => handleUnblockUser(blockedUser._id , index)} className="px-5 py-1  absolute lg:right-10 md:right-5 right-1 flex justify-center items-center cursor-pointer gap-3">
                              <img className="w-7 h-7" src={assets.unBlockIcon} alt="" />
                              <span>Unblock</span>
                            </button>
                          </div>
                          {
                            blockedUsers.length < blockedUsersCount
                            ?
                            <div ref={ref} className="w-full h-auto mt-3">
                              <Loader />
                            </div>
                            :
                            null
                          }
                        </>

                      ))
                      :
                      <div className="w-full h-100 flex justify-center items-center flex-col">
                        <img className="w-50 h-50" src={assets.notUserFoundIcon} alt="" />
                        <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-xl`}>No blocked users</h1>
                      </div>
                    }
                  </div>
                  :
                  <>
                  {
                    profile?.authType === "Email"
                    ?
                    <div onClick={() => setPageState({ ...pageState, passwordScreen: true, themeScreen: false, blockUsersScreen: false })} className={`lg:w-[60%] md:w-[70%] w-[95%] h-auto mt-5 py-2 px-2 flex items-center rounded-md gap-4 cursor-pointer ${theme === "dark" ? "bg-blackForeground" : "bg-white"}`}>
                      <img className="w-10 h-10" src={assets.changePasswordIcon} alt="" />
                      <span className={`lg:text-lg text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>Change password</span>
                    </div>
                    :
                    null
                  }
                    <div onClick={() => setPageState({ ...pageState, passwordScreen: false, themeScreen: true, blockUsersScreen: false })} className={`lg:w-[60%] md:w-[70%] w-[95%] h-auto mt-5 py-2 px-2 flex items-center rounded-md gap-4 cursor-pointer ${theme === "dark" ? "bg-blackForeground" : "bg-white"}`}>
                      <img className="w-10 h-10" src={assets.changeThemeIcon} alt="" />
                      <span className={`lg:text-lg text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>Theme</span>
                    </div>
                    <div onClick={() => setPageState({ ...pageState, passwordScreen: false, themeScreen: false, blockUsersScreen: true })} className={`lg:w-[60%] md:w-[70%] w-[95%] h-auto mt-5 py-3 px-2 flex items-center rounded-md gap-4 cursor-pointer ${theme === "dark" ? "bg-blackForeground" : "bg-white"}`}>
                      <img className="w-9 h-9" src={assets.blockedUsersIcon} alt="" />
                      <span className={`lg:text-lg text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>Blocked people</span>
                    </div>
                    <div onClick={handleLogout} className={`lg:w-[60%] md:w-[70%] w-[95%] h-auto mt-5 py-3 px-2 flex items-center rounded-md gap-4 cursor-pointer ${theme === "dark" ? "bg-blackForeground" : "bg-white"}`}>
                      <img className="w-8 h-8" src={assets.logoutIcon} alt="" />
                      <span className={`lg:text-lg text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>Logout</span>
                    </div>
                  </>
          }
        </div>
      </div>
    </div>
  );
};

export default Settings;
