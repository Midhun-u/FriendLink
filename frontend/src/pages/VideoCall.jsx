import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallingState,
} from '@stream-io/video-react-sdk'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Layout from '../components/Layout'
import {useSelector} from 'react-redux'
import { assets } from '../assets/assets'

const VideoCall = () => {

  const { callId } = useParams()
  const [token, setToken] = useState("")
  const [user, setUser] = useState(null)
  const [call, setCall] = useState(null)
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const {theme} = useSelector(state => state.theme)

  const navigate = useNavigate()

  //function for initilize stream video call
  const initVideoCall = async () => {

    try {

        setLoading(true)

        const userData = {
          id: user?._id,
          name: user?.fullName,
          image: user?.profilePic
        }

        const apiKey = import.meta.env.VITE_STREAM_API_KEY
        const videoClient = new StreamVideoClient({ apiKey: apiKey, user: userData, token: token }) // config stream
        const callInstance = videoClient.call("default", callId)

        setCall(callInstance)
        setClient(videoClient)

        await callInstance.join({ create: true })
        toast.success("Joined call")

    } catch (error) {
      toast.error("Couldn't connect call")
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {

    if (localStorage.length > 0 && localStorage.getItem("stream-token")) {

      const streamToken = localStorage.getItem("stream-token")
      const user = JSON.parse(localStorage.getItem("user"))
      setToken(streamToken)
      setUser(user)

      localStorage.setItem("stream-token" , null)
      localStorage.setItem("user" , null)

    } else {

      navigate("/")

    }

  }, [])

  useEffect(() => {

    if(token && user && callId){
      initVideoCall()
    }

  }, [user])

  return (

    <div className={`w-screen h-screen flex flex-col items-center justify-center ${theme === "dark" ? "bg-blackForeground text-white" : "bg-white text-black"}`}>
      {
          loading
          ?
          <div className='w-full h-full flex justify-center items-center'>
            <Loader />
          </div>
          :
          null
      }
      <div className='relative'>
        {
          client && call
            ?
            <div>
              <StreamVideo client={client}>
                <StreamCall call={call}>
                  <Layout CallingState={CallingState} />
                </StreamCall>
              </StreamVideo>
            </div>
            :
            <div className='flex justify-center items-center flex-col gap-4'>
              <img className='w-20 h-20' src={assets.disconnectIcon} alt="" />
              <span className='text-lg'>Could not found</span>
            </div>
        }
      </div>
    </div>

  )
}

export default VideoCall