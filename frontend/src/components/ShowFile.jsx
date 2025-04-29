import React , {useEffect, useState} from 'react'
import { useNavigate } from 'react-router'
import { decryptMessageFunction } from '../utilities/utilities'
import { assets } from '../assets/assets'

const ShowFile = () => {

    const [file , setFile] = useState({
        mediaType : "",
        mediaURL : "" 
    })
    const [receiver , setReceiver] = useState()
    const navigate = useNavigate()

    useEffect(() => {

        const session = JSON.parse(sessionStorage.getItem("session"))

        if(session){

            setFile({...file , mediaType : session.mediaType , mediaURL : decryptMessageFunction(session.mediaURL)})
            setReceiver(session.receiver)
            sessionStorage.clear()

        }else{
            navigate("/")
        }

    } , [])

    //function for navigate home
    const handleNavigateHome = () => {

        sessionStorage.setItem("person" , JSON.stringify(receiver))
        navigate("/")

    }

  return (

    <div className='w-screen h-screen bg-black flex justify-center items-center'>
        {
            file.mediaType === "image"
            ?
            <div className='w-full h-full flex justify-center items-center relative'>
                <img className='w-[30%] aspect-auto' src={file.mediaURL} alt="" />
                <img onClick={handleNavigateHome} className='absolute w-10 h-10 z-10 top-5 left-5' src={assets.backButtonIcon} alt="" />
            </div>
            :
            (
                file.mediaType === "video"
                ?
                <div className='w-screen h-screen flex justify-center items-center relative'>
                    <video controls width="420" height="240" className='p-10'>
                        <source src={file.mediaURL}/>
                    </video>
                    <img onClick={handleNavigateHome} className='absolute w-10 h-10 z-10 top-5 left-5' src={assets.backButtonIcon} alt="" />
                </div>
                :
                null
            )
        }
    </div>

  )
}

export default ShowFile