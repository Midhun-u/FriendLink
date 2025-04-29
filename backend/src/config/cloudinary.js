import {v2 as cloudinary} from 'cloudinary'
import 'dotenv/config'

//cloudinary config
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

//function for upload image on cloudinary
const uploadAsset = async (mediaUrl , type) => {

    try{


        const upload = await cloudinary.uploader.upload(mediaUrl , {
            folder : "friendlink_assets",
            overwrite : true,
            resource_type : type === "video" ? "video" : "image"
        })

        return upload.secure_url

    }catch(error){

        console.log("cloudinary error : " + error)

    }

}

export default uploadAsset