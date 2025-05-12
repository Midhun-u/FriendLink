import React from 'react'
import {Route , Routes} from 'react-router'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import ForgetPassword from '../pages/ForgetPassword'
import Home from '../pages/Home'
import People from '../pages/People'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'
import ShowFile from '../components/ShowFile'
import VideoCall from '../pages/VideoCall'

const Router = () => {

  return (

    <>
      <Routes>
        <Route path='/sign' element = {<Signup />} />
        <Route path='/login' element = {<Login />} />
        <Route path='/forget-password' element = {<ForgetPassword />} />
        <Route path='/' element = {<Home />} />
        <Route path='/people' element = {<People />} />
        <Route path='/notifications' element = {<Notifications />} />
        <Route path='/profile' element = {<Profile />} />
        <Route path='/settings' element = {<Settings />} />
        <Route path='/file' element = {<ShowFile />} />
        <Route path='/call/:callId' element = {<VideoCall />} />
        <Route path='*' element = {<NotFound />} />
      </Routes>
    </>
  )
}

export default Router