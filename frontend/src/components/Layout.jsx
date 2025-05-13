import { CallControls, SpeakerLayout, StreamTheme, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useNavigate } from "react-router"
import {useSelector} from 'react-redux'
import '@stream-io/video-react-sdk/dist/css/styles.css'

const Layout = ({CallingState , user}) => {

  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState()
  const navigate = useNavigate()
  const {theme} = useSelector(state => state.theme)

  if(callingState === CallingState.LEFT){

    navigate("/")

  }

  return (

    <div className={`${theme === "dark" ? "bg-blackForeground text-black" : "bg-white text-white"}`}>
        <StreamTheme style={theme === "dark" ? {backgroundColor : "black" , color : "white"} : {backgroundColor : "white"  , color : "black"}}>
            <SpeakerLayout participantsBarPosition={"bottom"}/>
            <CallControls />
        </StreamTheme>
    </div>

  )
}

export default Layout