import User from '../models/user.model.js'
import {Message} from '../models/message.model.js'
import uploadAsset from '../config/cloudinary.js'
import { encryptFile } from '../utilities/encryptFile.js'
import { generateStreamToken } from '../config/stream.js'

//controller for get added users
export const getAddedUsersController = async (request , response) => {

    try{

        const {id : userId} = request.user
        let {page} = request.query || 1
        page = parseInt(page)
        const limit = 20

        if(userId){

            const user = await User.findById(userId).populate("addedUsers")
            const addedUsers = user.addedUsers.slice((page - 1) * limit , page * limit)
            const totalCount = user.addedUsers.length

            response.status(200).json({success : true , addedUsers : addedUsers , totalCount : totalCount , user : user})

        }

    }catch(error){

        response.status(500).json({error : "Server error "})
        console.log("getAddedUser error : " + error)

    }

}

//controller for send message
export const sendMessageController = async (request , response) => {

    try{

        const {id : userId} = request.user
        const {receiverId} = request.params
        const {message , file} = request.body

        if(message && userId && receiverId  || file && userId && receiverId){

            const receiver = await User.findOne({_id : receiverId})

            let mediaType = ""
            let mediaURL = ""

            if(file){

                mediaType = file.includes("image") ? "image" : "video"
                mediaURL = await uploadAsset(file , mediaType)
                mediaURL = encryptFile(mediaURL)
            }

            const createMessage = await Message.create({
    
                    sender : userId,
                    receiver : receiverId,
                    ...(message && {message : message}),
                    ...(mediaType && mediaURL && {mediaType : mediaType.toUpperCase() , mediaURL : mediaURL}),
                    createdAt : new Date()
    
            })

            if(createMessage){

                const index = receiver.addedUsers.indexOf(userId)
                receiver.addedUsers.splice(index , 1)
                receiver.addedUsers.unshift(userId)

                await Promise.all([
                    receiver.save(),
                    User.updateOne({_id : userId} , {$push : {lastMessages : {$each : [createMessage] , $position : 0}}}),
                    User.updateOne({_id : receiverId} , {$push : {lastMessages : {$each : [createMessage] , $position : 0}}})
                ])


                response.status(201).json({success : true , message : "Message created" , createdMessage : createMessage})
    
            }
        }else{
            response.status(400).json({success : false , message : "Fields are missing"})
        }


    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("sendMessage controller error : " + error)

    }

}

//controller for get messages
export const getMessageController = async (request , response) => {

    try{

        const {id : userId} = request.user
        const {receiverId} = request.params
        let {page} = request.query || 1
        page = typeof page === "string" ? parseInt(page) : page
        const limit = 30
        const skip = (page - 1) * limit

        if(receiverId && userId){

            const [receiver , user] = await Promise.all([
                User.findOne({_id : receiverId}),
                User.findOne({_id : userId})
            ])

            if(receiver.blockedUsers.includes(userId) || user.blockedUsers.includes(receiverId)){
                return response.status(400).json({success : false , blocked : true , message : "Blocked"})
            }

            const messages = await Message.find({

                $or : [
                    {sender : userId , receiver : receiverId},
                    {sender : receiverId , receiver : userId}
                ]

            })
            .sort({createdAt : 1})
            .populate(['sender' , 'receiver'])
            .skip(skip)
            .limit(limit)

            const totalCount = await Message.countDocuments({$or : [
                {sender : userId , receiver : receiverId},
                {sender : receiverId , receiver : userId}
            ]})

            response.status(200).json({success : true , messages : messages , totalCount : totalCount})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("getMessage controller error : " + error)

    }

}

//controller for general stream token
export const getStreamTokenController = async (request , response) => {

    try {
        
        const {id : userId} = request.user

        if(userId){

            const token = await generateStreamToken(userId)

            if(token){
                response.status(200).json({success : true , streamToken : token})
            }

        }

    } catch (error) {
        
        response.status(500).json({error : "Server error"})
        console.log("getStreamToken controller error : " + error)

    }

}