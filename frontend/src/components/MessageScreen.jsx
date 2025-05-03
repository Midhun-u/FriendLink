import React, { useEffect, useRef, useState } from "react"
import { assets } from "../assets/assets";
import { getMessageApi, sendMessageApi } from "../api/messageApi"
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

const MessageScreen = ({
  setMessageScreen,
  receiver,
  setReceiver,
  userProfile,
  socket
}) => {
  const [moreSection, setMoreSection] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [blockedMessage, setBlockedMessage] = useState()
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const { inView, ref } = useInView();
  const chatContainerRef = useRef(null);
  const [file, setFile] = useState("")
  const imageRef = useRef(null)
  const [emoji, setEmoji] = useState(false)
  const [profileScreen, setProfileScreen] = useState(false)
  let disableButton = false
  const navigate = useNavigate()

  //function for get messages
  const getMessages = async () => {

    try {

      const result = await getMessageApi(receiver._id, page)

      if (result.success) {
        setMessages((preMessage) => {

          if (page === 1) {
            return result.messages
          } else {
            return [...preMessage, ...result.messages]
          }

        })

        setTotalCount(result.totalCount);
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

        let encryptedMessage = ""

        if (inputValue) {

          //encrypt message
          encryptedMessage = encryptMessageFunction(inputValue);

        }

        disableButton = true
        const result = await sendMessageApi(encryptedMessage, receiver._id, file)

        if (result.success) {
          setInputValue("");
          setFile("")
          socket.emit("send-message", result.createdMessage)
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
    setPage(page + 1)
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

      setMessages((preMessage) => [...preMessage, messageData])

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

    try{

      const result = await unblockUser(personId)
      
      if(result.success){

        toast.success(result.message)
        setMoreSection(false)
        setMessageScreen(false)

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
      <div className="grid grid-rows-[70px_1fr_70px] lg:grid-rows-[90px_1fr_90px] w-full h-full absolute overflow-scroll lg:relative">
        <div className="w-full h-full bg-white grid grid-cols-[1fr_100px] px-2 lg:px-5 rounded-md relative">
          <div className="grow w-full h-full flex justify-start items-center lg:px-5 overflow-hidden cursor-pointer gap-4">
            <img
              onClick={() => {
                setMessageScreen(false);
                setReceiver({});
              }}
              className="w-6 h-6 lg:hidden cursor-pointer"
              src={assets.backButtonIcon}
              alt=""
            />
            {receiver.profilePic ? (
              <img
                className="w-13 h-13 lg:w-18 lg:h-18 rounded-full"
                src={receiver.profilePic}
                alt=""
              />
            ) : receiver.gender === "Male" ? (
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
              <span className="lg:text-lg">{receiver.fullName}</span>
              {receiver.online ? (
                <span className="text-green-600 text-sm">Online</span>
              ) : (
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
            />
            <img
              onClick={() => setMoreSection(!moreSection)}
              className={`${moreSection ? "w-4 h-4 lg:w-5 lg:h-5" : "w-7 h-7 lg:w-10 lg:h-10 "} cursor-pointer`}
              src={moreSection ? assets.closeIcon : assets.moreIcon}
              alt=""
              title="More"
            />
            {moreSection ? (
              <div className="w-50 h-auto absolute top-24 right-10 flex flex-col items-center bg-white rounded-md z-10">
                {
                  blockedMessage
                  ?
                  <div onClick={() => handleUnBlockUser(receiver._id)} className="w-full h-12 lg:h-15 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-5">
                    <img className="w-7 h-7 lg:w-10 lg:h-10" src={assets.unBlockIcon} alt="" />
                    <span>Unblock</span>
                  </div>
                  :
                  <div onClick={() => handleBlockUser(receiver._id)} className="w-full h-12 lg:h-15 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-5">
                    <img
                      className="w-7 h-7 lg:w-10 lg:h-10"
                      src={assets.blockIcon}
                      alt=""
                    />
                    <span>Block</span>
                  </div>

                }
                <div onClick={() => {
                  setProfileScreen(true)
                  setMoreSection(false)
                }} className="w-full h-12 lg:h-15 flex items-center gap-3 cursor-pointer hover:bg-gray-300 px-5">
                  <img
                    className="w-7 h-7 lg:w-10 lg:h-10"
                    src={assets.viewProfileIcon}
                    alt=""
                  />
                  <span>View Profile</span>
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
          className="w-full h-full bg-gray-100 overflow-scroll px-3 py-2 flex flex-col gap-5"
        >
          <div className="w-full h-auto flex justify-center items-center relative gap-3">
            <img className="w-5 h-5 relative top-2" src={assets.encryptIcon} alt="" />
            <p className="text-sm mt-4 px-2 bg-gray-200">Messages are end-to-end encrypted. No one outside of this chat</p>
          </div>
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
                    message.mediaType === "image" && message.mediaURL
                      ?
                      <div className={`w-fit h-auto max-w-[50%] px-2 py-1 flex flex-col gap-3 justify-center items-center overflow-hidden`}>
                        <img onClick={() => {
                          sessionStorage.setItem("session", JSON.stringify({ mediaType: "image", mediaURL: message.mediaURL, receiver: receiver }))
                          navigate(`/file`)
                        }} className="lg:w-40 lg:h-40 w-30 h-30 cursor-pointer" src={decryptMessageFunction(message.mediaURL)} alt="" />
                        <p className={`break-all whitespace-normal w-auto h-auto lg:text-lg md:text-md text-sm ${message.message ? "px-2 py-1" : ""} rounded-md ${message.sender._id === userProfile._id || message.sender === userProfile._id ? "bg-white text-black" : "bg-[#39B1D9] text-white"}`} >{decryptMessageFunction(message.message)}</p>
                      </div>
                      :
                      (
                        message.mediaType === "video" && message.mediaURL

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
                            <p className={`break-all whitespace-normal w-auto h-auto lg:text-lg md:text-md text-sm ${message.message ? "px-2 py-1" : ""} rounded-md ${message.sender._id === userProfile._id || message.sender === userProfile._id ? "bg-white text-black" : "bg-[#39B1D9] text-white"}`}>{decryptMessageFunction(message.message)}</p>
                          </div>
                          :
                          <div
                            className={`w-fit h-auto max-w-[50%] px-2 py-1 flex justify-center items-center ${message.sender._id === userProfile._id || message.sender === userProfile._id
                              ? "bg-white text-black"
                              : "bg-[#39B1D9] text-white"
                              } rounded-md overflow-hidden`}
                          >
                            <p className="break-all whitespace-normal lg:text-lg md:text-md text-sm">
                              {decryptMessageFunction(message.message)}
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
              <span>Can't send message</span>
            </div>
            :
            <div className="w-full h-full bg-inherit flex flex-col justify-center items-center gap-3">
              <img
                className="w-15 h-15 lg:w-20 lg:h-20 "
                src={assets.messageIcon}
                alt=""
              />
              <span className="lg:text-lg md:text-md text-sm">Let's Chat</span>
            </div>
          )}
          {
            messages?.length < totalCount
              ?
              <div ref={ref} className="w-full h-10">
                <Loader />
              </div>
              :
              null
          }
        </div>
        <div className="w-full h-full bg-gray-100 flex justify-center items-center">
          <div className={`w-[95%] h-[90%] rounded-md ${blockedMessage ? "bg-gray-100" : "bg-white"} grid grid-cols-[auto_1fr_auto] content-center px-3 relative`}>
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
                      <EmojiPicker onEmojiClick={(emojiEvent) => setInputValue((preInputValue) => preInputValue + emojiEvent.emoji)} style={{ position: "absolute", bottom: "0px" }} />
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
                      className="resize-none w-full h-full outline-none pl-5 pr-13"
                      placeholder="Enter your message here"
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
        </div>
      </div>
      {
        profileScreen
          ?
          <div className="w-screen h-screen z-10 absolute bg-white/10 backdrop-blur-md flex justify-center items-center py-3">
            <ViewProfile person={receiver} setProfileScreen={setProfileScreen} />
          </div>
          :
          null
      }
    </>
  );
};

export default MessageScreen