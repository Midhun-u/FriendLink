import React, { useEffect , useState}  from "react"
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router'
import {toast} from 'react-toastify'
import { profileApi } from "../api/authApi"
import {sendRequest , removeRequest , removePerson} from '../api/peopleApi'

const ViewProfile = ({person , setProfileScreen , setRequestedUsers , requestedUsers}) => {
  
  const navigate = useNavigate()
  const [profile , setProfile] = useState()
  const [removeScreen , setRemoveScreen] = useState()
  
  //function for get user
  const handleGetUser = async () => {
    
    try{
      
      const result = await profileApi()
      
      if(result.success){
        setProfile(result.profile)
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
    
    handleGetUser()
    
  } , [])
  
  //function for remove person
  const handleRemovePerson = async () => {
    
    try{
      
      const result = await removePerson(person._id)
      
      if(result.success){
        toast.success(result.message)
        setProfileScreen(false)
        navigate("/")
        window.location.reload()
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
  
  //function for send request
  const handleSendRequest = async () => {
    
    try {
      if (person._id) {
        const result = await sendRequest(person._id);

        if (result.success) {
          toast.success(result.message);
          setProfileScreen(false)
          setRequestedUsers(prev => [...prev , person._id])
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
  
  //function for remove request
  const handleRemoveRequest = async () => {
    
    try{
      
      const result = await removeRequest(person._id)
      
      if(result.success){
        
        toast.success(result.message)
        
        const filteredRequests = requestedUsers.filter(requestedUsersId => requestedUsersId != person._id)
        setRequestedUsers(filteredRequests)
        setProfileScreen(false)
        
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
  
  return (
    
    <>
      {
        removeScreen
        ?
        <div className="lg:w-[40%] md:min-h-[40%] px-3 min-h-[40%] w-[70%] h-auto rounded-md flex flex-col justify-center items-center py-2 relative gap-3 bg-gray-50 shadow-xl">
            <div className="w-full h-auto flex justify-center items-center gap-3">
              <img className="w-5 h-5" src={assets.warningIcon} />
              <p>Do you want to remove {person.fullName}</p>
            </div>
            <div className="w-full h-full flex justify-between px-10 mt-10">
              <button onClick={() => {
                handleRemovePerson()
                setRemoveScreen(false)
                setProfileScreen(false)
              }} className="px-5 py-1 bg-red-500 text-white cursor-pointer rounded-md">Yes</button>
              <button onClick={() => setRemoveScreen(false)} className="px-5 py-1 bg-white text-black cursor-pointer rounded-md">No</button>
            </div>
        </div>
        :
      <div className="lg:w-[40%] md:min-h-[60%] min-h-[90%] h-auto rounded-md bg-white flex flex-col items-center justify-center py-2 relative gap-3">
        <div onClick={() => setProfileScreen(false)} className="absolute top-6 right-5 w-7 h-7  cursor-pointer hover:bg-gray-100 rounded-full flex justify-center items-center">
          <img className="w-4 h-4" src={assets.closeIcon} />
        </div>
        {
          person.profilePic
          ?
          <img className="w-30 h-30 rounded-full " src={person.profilePic} />
          :
          (
            person.gender === "Male"
            ?
            <img className="w-30 h-30 rounded-full " src={assets.maleGenderIcon} />
            :
            (
              person.gender === "Female"
              ?
              <img className="w-30 h-30 rounded-full " src={assets.femaleGenderIcon} />
              :
              <img className="w-30 h-30 rounded-full " src={assets.nullProfilePic} />
            )
          )
        }
        <span className="lg:text-lg text-md">{person.fullName}</span>
        <p className="px-10 lg:text-md text-sm">{person.bio}</p>
        <p>Gender : {person.gender}</p>
        <div className="w-full h-auto px-5 flex flex-wrap mt-10 justify-center gap-10">
          {
            profile?.addedUsers?.includes(person._id)
            ?
            <>
              <div onClick={() => {
                setProfileScreen(false)
                navigate("/")
                sessionStorage.setItem("person", JSON.stringify(person))
              }} className="w-auto h-auto flex flex-col items-center justify-center cursor-pointer py-1 px-5 rounded-md hover:bg-gray-100">
                <img className="w-10 h-10" src={assets.messageIcon} />
                <span className="text-sm">Message</span>
              </div>
              <div className="w-auto h-auto flex flex-col items-center justify-center cursor-pointer py-1 px-5 rounded-md hover:bg-gray-100">
                <img className="w-10 h-10" src={assets.videoCallIcon} />
                <span className="text-sm">Video call</span>
              </div>
              <div onClick={() => setRemoveScreen(true)} className="w-auto h-auto flex flex-col items-center justify-center cursor-pointer py-1 px-5 rounded-md hover:bg-gray-100">
                <img className="w-10 h-10" src={assets.removePersonIcon} />
                <span className="text-sm">Remove</span>
              </div>
            </>
            :
            (
              profile?.requestedUsers.includes(person._id)
              ?
              <div onClick={handleRemoveRequest} className="w-auto h-auto flex items-center justify-center cursor-pointer py-2 px-5 gap-3 rounded-md hover:bg-gray-100">
                <img className="w-5 h-5" src={assets.cancelIcon} />
                <span className="text-sm">Cancel request</span>
              </div>
              :
              <div onClick={handleSendRequest} className="w-auto h-auto flex flex-col items-center justify-center cursor-pointer py-1 px-5 rounded-md hover:bg-gray-100">
                <img className="w-10 h-10" src={assets.addPeopleIcon} />
                <span className="text-sm">Add</span>
              </div>
            )
          }
        </div>
      </div>
      }
    </>
    
  )
  
}

export default ViewProfile