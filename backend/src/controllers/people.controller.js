import { notificationConfig } from "../config/notificationConfg.js"
import User from "../models/user.model.js"
import mongoose from "mongoose"

//controller for getting users
export const getUsersController = async (request , response) => {

    try{

        const {id : userId} = request.user
        let {page} = request.query || 1
        page = parseInt(page)
        const limit = 20
        const skip = (page - 1) * limit

        if(userId){

            const [people, totalCount] = await Promise.all([

                User.aggregate([
                    {$match : {_id : {$ne : new mongoose.Types.ObjectId(userId)}}},
                    {$project : {password : 0}},
                    {$skip : skip},
                    {$limit : limit},
                    {$sample : {size : 100000}}
                ]),

                User.countDocuments()
            ])
            response.status(200).json({success : true , people : people , totalCount : totalCount - 1})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("getUsers controller error : " + error)

    }

} 

//controller for send request
export const sendRequestController = async (request , response) => {

    try{

        const {id : personId} = request.params
        const {id : userId} = request.user
        
        if(personId && userId){

            const [person , user] = await Promise.all([
                User.findOne({_id : personId}).select("-password"),
                User.findOne({_id : userId}).select("-password")
            ])

            if(person){


                const check = person.notifications.some((person) => person.person._id == userId)

                if(check){

                    response.status(400).json({success : false , message : "Request already sent"})

                }else{

                    const message = notificationConfig(user)
                    person.notifications.unshift(message)
                    user.requestedUsers.push(person._id)

                    await Promise.all([
                      person.save(),
                      user.save()
                    ])

                    response.status(200).json({success : true , message : "Request sent"})
                }



            }else{
                response.status(400).json({success : false , message : "User not found"})
            }

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("send request controller error : " + error)

    }

}

//controller for remove person
export const removePersonController = async (request , response) => {
  
  try{
    
    const {personId} = request.params
    const {id : userId} = request.user
    
    if(personId && userId){
      
      const user = await User.findOne({_id : userId})
      
      const filteredAddedUsers = user.addedUsers.filter(addedUsersId => addedUsersId != personId) || []
      const filteredLastMessages = user.lastMessages.filter(messages => messages.sender != personId && messages.receiver != personId) || []
      
      user.addedUsers = filteredAddedUsers
      user.lastMessages = filteredLastMessages
      await user.save()
      
      response.status(200).json({ success: true, message : "Person removed"})
      
    }
    
  }catch(error){
    
    response.status(500).json({error : "Server error"})
    console.log("removePerson controller error : " + error)
    
  }
  
}

//controller for remove request
export const removeRequestController = async (request , response) => {
  
  try{
    
    const {personId} = request.params
    const {id : userId} = request.user
    
    if(personId && userId){
      
      const [person , user] = await Promise.all([
        User.findOne({_id : personId}),
        User.findOne({_id : userId})
      ])
      
      const check = user.requestedUsers.includes(personId)
      
      if(check){
        
        const filteredRequest = user.requestedUsers.filter(requestUsersId => requestUsersId != personId)
        const filteredNotifications = person.notifications.filter(notifications => notifications.person._id != userId)
        
        user.requestedUsers = filteredRequest
        person.notifications = filteredNotifications
        
        await Promise.all([
          user.save(),
          person.save()
        ])
        
        response.status(200).json({success : true , message : "Request cancelled"})
        
      }else{
        
        response.status(400).json({success : false , message : "Already removed"})
        
      }
      
    }
    
  }catch(error){
    
    response.status(500).json({error : "Server error"})
    console.log("removeRequest controller error : " + error)
    
  }
  
}