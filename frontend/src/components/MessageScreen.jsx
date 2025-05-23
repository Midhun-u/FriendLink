import React, { useEffect, useRef, useState } from "react"
import { assets } from "../assets/assets";
import { getMessageApi, getStreamToken, sendMessageApi } from "../api/messageApi"
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer"
import Loader from "../components/Loader"
import {
  decryptMessageFunction,
  encryptMessageFunction,
} from "../utilities/utilities"
import EmojiPicker from 'emoji-picker-react'
import { useNavigate } from "react-router";
import ViewProfile from "./ViewProfile";
import { blockUser, unblockUser } from "../api/peopleApi";
import { useSelector } from 'react-redux'

const MessageScreen = ({
  setMessageScreen,
  receiver,
  setReceiver,
  userProfile,
  socket,
  onlineUsers,
  blockedUsers,
  setBlockedUsers,
}) => {

  const { theme } = useSelector(state => state.theme)
  const [moreSection, setMoreSection] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages , setMessages] = useState([])
  const [blockedMessage, setBlockedMessage] = useState()
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const { inView, ref } = useInView();
  const chatContainerRef = useRef(null);
  const [file, setFile] = useState("")
  const imageRef = useRef(null)
  const [emoji, setEmoji] = useState(false)
  const [profileScreen, setProfileScreen] = useState(false)
  const [typingUsersData , setTypingUsersData] = useState()
  const navigate = useNavigate()
  const [disableButton , setDisableButton] = useState(false)

  //function for get messages
  const getMessages = async () => {

    try {

      const result = await getMessageApi(receiver._id, page)

      if (result.success) {

        setMessages((preMessage) => {

          if (page === 1) {
            return [...result.messages]
          } else {
            return [...preMessage , ...result.messages]
          }

        })

        setTotalCount(result.totalCount)
      }
    } catch (error) {
      const errorMessage = error?.response.data

      if (errorMessage.auth === false) {
        navigate("/login")
      } else if (errorMessage.message && errorMessage.blocked) {
        setBlockedMessage(errorMessage.message)
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  //function for send message
  const handleSendMessage = async () => {

    if (inputValue || file) {

      try {

        setDisableButton(true)
        let encryptedMessage = ""

        if (inputValue) {

          //encrypt message
          encryptedMessage = encryptMessageFunction(inputValue);

        }

        const result = await sendMessageApi(encryptedMessage, receiver._id, file)

        if (result.success) {
          setInputValue("");
          setFile("")
          socket.emit("send-message", result.createdMessage)
          setDisableButton(false)
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
  }

  //function for set image
  const handleSetFile = (fileForRead) => {

    try {

      if (fileForRead.type.includes("image") || fileForRead.type.includes("video")) {

        //Read file
        const reader = new FileReader()
        reader.readAsDataURL(fileForRead)
        reader.onload = () => {

          setFile(reader.result)

        }

      } else {
        toast.error("Unsupported file")
      }



    } catch (error) {
      setFile("")
    }

  }

  useEffect(() => {
    getMessages()
  }, [page])

  useEffect(() => {

    setPage(1)
    setMessages([])
    getMessages()

  }, [receiver])

  useEffect(() => {
    if(inView && messages.length < totalCount){
      setPage((pre) => pre + 1)
    }
  }, [inView])


  useEffect(() => {

    if (chatContainerRef.current) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  useEffect(() => {

    socket.on("receive-message", (messageData) => {
      setMessages((preMessage) => [...preMessage , messageData])
    })

    return () => {
      socket.off("receive-message")
    }

  }, [])

  //function for block user
  const handleBlockUser = async (personId) => {

    try {

      const result = await blockUser(personId)

      if (result.success) {
        toast.success(result.message)
        setMoreSection(false)
        setReceiver("")
        setMessageScreen(false)
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

  //function for unblock
  const handleUnBlockUser = async (personId) => {

    try {

      const result = await unblockUser(personId)

      if (result.success) {

        toast.success(result.message)
        setMoreSection(false)
        setMessageScreen(false)

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

  //function for send realtime "typing " feature
  const handleRealtimeTyping = (typingUserId , receiverId) => {

    socket.emit("typingUser" , typingUserId , receiverId)

    setTimeout(() => {

      socket.emit("remove-typingUser" , typingUserId)

    } , 1000)

  }

  useEffect(() => {

    socket.on("get-typingUsers" , (typingUsersData) => {
      
      setTypingUsersData(typingUsersData)

    })

    return () => socket.off("get-typingUsers")

  } , [])

  //function for video call
  const handleVideoCall = async () => {

    try {

        const channelId = [userProfile?._id , receiver._id].sort().join("-") //generate channel id
        const callURL = `${window.location.origin}/call/${channelId}` //generate call URL
        
        const encryptedMessage = encryptMessageFunction(callURL)  //encrypt message
        const message = await sendMessageApi(encryptedMessage, receiver._id)

        if (message.success) {
          setInputValue("");
          setFile("")
          socket.emit("send-message", message.createdMessage)
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

  //function for navigate to video call section
  const handleVideoCallNavigation = async (urlStr) => {

    if(urlStr){

      if(urlStr.includes("http://") || urlStr.includes("https://")){

        try{

          const url = new URL(urlStr)

          if(url.protocol && url.origin){

            const result = await getStreamToken(userProfile?._id)

            if(result.success){

              sessionStorage.setItem("stream-token" , result.streamToken)
              sessionStorage.setItem("user" , JSON.stringify(userProfile))
              window.location.href = url

            }

          }

        }catch(error){
          return 
        }
      }

    }else{
      return 
    }

  }

  //function for set cursor pointer when hover a url
  const handleHoverURL = (urlstr , event) => {

    try{

      if(urlstr.includes("http://") || urlstr.includes("https://")){

        const url = new URL(urlstr)

        if(url.protocol && url.origin){
          
          event.target.style.cursor = 'pointer'
          event.target.style.textDecoration = 'underline'

        }
      }

    }catch(error){
      return 
    }

  }

  return (
    <>
    {/* top bar */}
      <div className={`grid grid-rows-[70px_1fr_70px] lg:grid-rows-[90px_1fr_90px] w-full h-full absolute overflow-scroll lg:relative ${theme === "dark" ? "bg-blackBackground" : "bg-white"} `}>
        <div className={`w-full h-full grid grid-cols-[1fr_100px] px-2 lg:px-5 rounded-md ${theme === "dark" ? "bg-blackForeground" : "bg-white"}  relative`}>
          <div onClick={() => {
            setProfileScreen(true)
            setMoreSection(false)
          }} className="grow w-full h-full flex justify-start items-center lg:px-5 overflow-hidden cursor-pointer gap-4">
            <img
              onClick={() => {
                setMessageScreen(false);
                setReceiver({});
              }}
              className="w-6 h-6 lg:hidden cursor-pointer"
              src={assets.backButtonIcon}
              alt=""
            />
            {receiver?.profilePic ? (
              <img
                className="w-13 h-13 lg:w-18 lg:h-18 rounded-full"
                src={receiver?.profilePic}
                alt=""
              />
            ) : receiver?.gender === "Male" ? (
              <img
                className="w-13 h-13 lg:w-18 lg:h-18 rounded-full "
                src={assets.maleGenderIcon}
                alt=""
              />
            ) : (
              <img
                className="w-13 h-13 lg:w-18 lg:h-18 rounded-full"
                src={assets.femaleGenderIcon}
                alt=""
              />
            )}
            <div className="flex flex-col items-start">
              <span className={`lg:text-lg ${theme === "dark" ? "text-white" : "text-black"}`}>{receiver?.fullName}</span>
              {blockedUsers?.includes(receiver?._id) ? (
                <span className="text-red-600 text-sm">Blocked</span>
              ) : (
                onlineUsers.includes(receiver?._id)
                ?
                (
                  typingUsersData?.to === userProfile?._id && typingUsersData?.from === receiver?._id
                  ?
                  <span className="text-green-500 text-sm">Typing...</span>
                  :
                  <span className="text-green-500 text-sm">Online</span>
                )
                :
                <span className="text-gray-500 text-sm">Offline</span>
              )}
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center gap-5 relative">
            <img
              className="w-8 h-8 lg:w-10 lg:h-10 cursor-pointer"
              src={assets.videoCallIcon}
              alt=""
              title="Video call"
              onClick={handleVideoCall}
            />
            <img
              onClick={() => setMoreSection(!moreSection)}
              className={`${moreSection ? "w-4 h-4 lg:w-5 lg:h-5" : "w-7 h-7 lg:w-10 lg:h-10 "} cursor-pointer`}
              src={moreSection ? assets.closeIcon : assets.moreIcon}
              alt=""
              title="More"
            />
            {moreSection ? (
              <div className={`w-50 h-auto absolute top-24 right-10 flex flex-col items-center ${theme === "dark" ? "bg-blackForeground" : "bg-white"} rounded-md z-10`}>
                {
                  blockedMessage
                    ?
                    <div onClick={() => {
                      handleUnBlockUser(receiver?._id)
                      setBlockedUsers(pre => {
                        const filteredBlockedUsers = pre.filter(blockUsersId => blockUsersId !== receiver?._id)
                        return filteredBlockedUsers
                      })
                    }} className={`w-full h-12 lg:h-15 flex items-center gap-3 cursor-pointer hover:${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"} px-5`}>
                      <img className="w-7 h-7 lg:w-10 lg:h-10" src={assets.unBlockIcon} alt="" />
                      <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Unblock</span>
                    </div>
                    :
                    <div onClick={() => {
                      handleBlockUser(receiver?._id)
                      setBlockedUsers(pre => [...pre , receiver?._id])
                    }} className={`w-full h-12 lg:h-15 flex items-center gap-3 cursor-pointer hover:${theme === "dark" ? "bg-blackBackground" : "bg-white"} px-5`}>
                      <img
                        className="w-7 h-7 lg:w-10 lg:h-10"
                        src={assets.blockIcon}
                        alt=""
                      />
                      <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Block</span>
                    </div>

                }
                <div onClick={() => {
                  setProfileScreen(true)
                  setMoreSection(false)
                }} className={`w-full h-12 lg:h-15 flex items-center gap-3 cursor-pointer hover:${theme === "dark" ? "bg-blackBackground" : "bg-white"} px-5`}>
                  <img
                    className="w-7 h-7 lg:w-10 lg:h-10"
                    src={assets.viewProfileIcon}
                    alt=""
                  />
                  <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>View Profile</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div
          ref={chatContainerRef}
          onClick={() => {
            setMoreSection(false)
            setEmoji(false)
          }}
          className={`w-full h-full ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"} overflow-scroll px-3 py-2 flex flex-col gap-5`}
        >
          <div className="w-full h-auto flex justify-center items-center relative gap-3">
            <img className="w-5 h-5 relative top-2" src={assets.encryptIcon} alt="" />
            <p className={`text-sm mt-4 px-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Messages are end-to-end encrypted. No one outside of this chat</p>
          </div>
          {/* Message screen */}
          {messages?.length ? (
            messages?.map((message, index) => (
              <>
                <div
                  className={`w-full h-auto flex ${message.sender._id == userProfile._id || message.sender == userProfile._id
                    ? "justify-end"
                    : "justify-start"
                    }`}
                  key={index}
                >
                  {
                    message.mediaType === "IMAGE" && message.mediaURL
                      ?
                      <div className={`w-fit h-auto max-w-[50%] px-2 py-1 flex flex-col gap-3 justify-center items-center overflow-hidden`}>
                        <img onClick={() => {
                          sessionStorage.setItem("session", JSON.stringify({ mediaType: "image", mediaURL: message.mediaURL, receiver: receiver }))
                          navigate(`/file`)
                        }} className="lg:w-40 lg:h-40 w-30 h-30 cursor-pointer" src={decryptMessageFunction(message.mediaURL)} alt="" />
                        <p className={`break-all whitespace-normal w-auto h-auto lg:text-lg md:text-md text-sm ${message.message ? "px-2 py-1" : ""} rounded-md ${message.sender._id === userProfile._id || message.sender === userProfile._id ? theme === "dark" ? "bg-blackForeground text-white" : "bg-white text-black" : "bg-[#39B1D9] text-white"}`} >{decryptMessageFunction(message.message)}</p>
                      </div>
                      :
                      (
                        message.mediaType === "VIDEO" && message.mediaURL

                          ?
                          <div className="w-fit h-auto max-w-[50%] px-2 py-1 flex flex-col gap-3 justify-center items-center overflow-hidden cursor-pointer">
                            <div onClick={() => {
                              sessionStorage.setItem("session", JSON.stringify({ mediaType: "video", mediaURL: message.mediaURL, receiver: receiver }))
                              navigate(`/file`)
                            }} className="w-auto h-auto relative flex justify-center items-center">
                              <video width="300" height="300" className="cursor-pointer">
                                <source src={decryptMessageFunction(message.mediaURL)} />
                              </video>
                              <img className="absolute w-10 h-10" src={assets.videoPlayIcon} alt="" />
                            </div>
                            <p className={`break-all whitespace-normal w-auto h-auto lg:text-lg md:text-md text-sm ${message.sender._id === userProfile._id || message.sender === userProfile._id ? theme === "dark" ? "bg-blackForeground text-white" : "bg-white text-black" : "bg-[#39B1D9] text-white"}`}>{decryptMessageFunction(message.message)}</p>
                          </div>
                          :
                          <div
                            className={`w-fit h-auto max-w-[50%] px-2 py-1 flex justify-center items-center ${message.sender._id === userProfile._id || message.sender === userProfile._id
                              ? theme === "dark" ? "bg-blackForeground text-white" : "bg-white text-black"
                              : "bg-[#39B1D9] text-white"
                              } rounded-md overflow-hidden`}
                          >
                            <p onClick={() => handleVideoCallNavigation(decryptMessageFunction(message.message))} onMouseEnter={(event) => handleHoverURL(decryptMessageFunction(message.message) , event)} className="break-all whitespace-normal lg:text-lg md:text-md text-sm">
                              { 
                                decryptMessageFunction(message.message)
                              }
                            </p>
                          </div>
                      )
                  }
                </div>
              </>
            ))
          ) : (
            blockedMessage
              ?
              <div className="w-full h-full bg-inherit flex flex-col justify-center items-center gap-3">
                <img className="w-15 h-15 lg:w-20 lg:h-20" src={assets.blockIcon} alt="" />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Can't send message</span>
              </div>
              :
              <div className="w-full h-full bg-inherit flex flex-col justify-center items-center gap-3">
                <img
                  className="w-15 h-15 lg:w-20 lg:h-20 "
                  src={assets.messageIcon}
                  alt=""
                />
                <span className={`lg:text-lg md:text-md text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>Let's Chat</span>
              </div>
          )}
          {
              messages.length < totalCount
              ?
              <div ref={ref} className="w-full h-10">
                <Loader />
              </div>
              :
              null
          }
        </div>
        {/* message typing area */}
        <div className={`w-full h-full ${theme === "dark" ? "bg-blackBackground" : "bg-gray-100"} flex justify-center items-center`}>
          {
            blockedMessage
            ?
            null
            :
            <div className={`w-[95%] h-[90%] rounded-md ${theme === "dark" ? "bg-blackForeground" : "bg-white"} grid grid-cols-[auto_1fr_auto] content-center px-3 relative`}>
            {
              file
                ?
                <div className="w-full h-50 absolute bottom-20 z-10 lg:bottom-18 flex flex-col justify-end gap-3 pb-5">
                  {
                    file.includes("image")
                      ?
                      <img className="w-20 h-20 lg:w-50 lg:h-50" src={file} alt="" />
                      :
                      (
                        file.includes("video")
                          ?
                          <video width="150" height="150" controls muted>
                            <source src={file} />
                          </video>
                          :
                          null
                      )
                  }
                  <img onClick={() => setFile("")} className="w-4 h-4 lg:w-5 lg:h-5 cursor-pointer" src={assets.closeImageIcon} alt="" />
                </div>
                :
                (
                  emoji
                    ?
                    <div className="w-full h-113 absolute bottom-25 z-10 flex md:justify-end justify-center md:px-0 px-3">
                      <EmojiPicker theme={theme === "dark" ? "dark" : "white"} onEmojiClick={(emojiEvent) => setInputValue((preInputValue) => preInputValue + emojiEvent.emoji)} style={{ position: "absolute", bottom: "0px" }} />
                    </div>
                    :
                    null
                )
            }
            {
              blockedMessage
                ?
                null
                :
                (
                  <>
                    <div className="h-full flex items-center">
                      <img
                        onClick={() => {
                          setEmoji(false)
                          imageRef.current?.click()
                        }}
                        className="w-8 h-8 lg:w-10 lg:h-10 cursor-pointer"
                        title="File"
                        src={assets.addFileIcon}
                        alt=""
                      />
                      <input onChange={(event) => handleSetFile(event.target.files[0])} ref={imageRef} type="file" hidden />
                    </div>
                    <div className="w-full px-5 flex items-center h-full relative">
                      <textarea
                        value={inputValue}
                        onFocus={() => setEmoji(false)}
                        onChange={(event) => setInputValue(event.target.value)}
                        className={`resize-none w-full h-full outline-none pl-5 pr-13 ${theme === "dark" ? "text-white placeholder-white" : "text-black"}`}
                        placeholder="Enter your message here"
                        onKeyDown={() => handleRealtimeTyping(userProfile?._id , receiver._id)}
                        
                      ></textarea>
                      <img
                        onClick={() => setEmoji(!emoji)}
                        className="w-6 h-6 lg:w-8 lg:h-8 rounde-full absolute right-7 cursor-pointer"
                        title="Emoji"
                        src={assets.emojiIcon}
                        alt=""
                      />
                    </div>
                    <div className="w-full h-full flex items-center">
                      <img
                        onClick={() => {

                          if (disableButton) {
                            setEmoji(false)
                          } else {
                            setEmoji(false)
                            handleSendMessage()
                          }

                        }}
                        title="Send"
                        className="w-8 -8 lg:w-10 lg:h-10 cursor-pointer"
                        src={assets.messageSendIcon}
                        alt=""
                      />
                    </div>
                  </>
                )
            }
          </div>
          }
        </div>
      </div>
      {
          profileScreen
          ?
          <div className={`w-screen h-screen z-10 absolute ${theme === "dark" ? "bg-black/10" : "bg-white/10"} backdrop-blur-md flex justify-center items-center py-3`}>
            <ViewProfile person={receiver} setProfileScreen={setProfileScreen} />
          </div>
          :
          null
      }
    </>
  );
};

export default MessageScreen