import User from "../models/user.model.js"

//controller for get notification
export const getNotificationController = async (request , response) => {

    try{

        const {id} = request.user //userId
        let {page} = request.query || 1
        page = parseInt(page)
        const limit = 10

        if(id){

            const user = await User.findOne({_id : id}).select("-password")
            const notifications = user.notifications.slice((page - 1) * limit , page * limit)
            const totalCount = user.notifications.length

            response.status(200).json({success : true , notifications : notifications , totalCount : totalCount})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("getNotification controller error : " + error)

    }

}

//controller for add user
export const addUserController = async (request , response) => {

    try {

        const {id : userId} = request.user
        const {personId} = request.params
        const {index} = request.query
    
        if(userId && personId){
    
           const [user , person ] = await Promise.all([
            User.findOne({_id : userId}),
            User.findOne({_id : personId})
           ])

           const check = person.addedUsers.some((person) => person._id == userId)
           
           if(!check){

                  user.addedUsers.unshift(personId)
                  person.addedUsers.unshift(userId)
                  user.notifications.splice(index , 1)

                  const filteredUser = person.requestedUsers.filter((requestUsersId) => requestUsersId  != userId)
                  person.requestedUsers = filteredUser

                  Promise.all([await user.save() , await person.save()])

                  response.status(200).json({success : true , message : "New person added"})
           }else{
                response.status(400).json({success : false , message : "Person already added"})
           }

        }
        
    } catch (error) {
        
        response.status(500).json({error : "Server error"})
        console.log("addUser controller error : " + error)

    }

}

//controller for ignore people
export const ignorePeopleController = async (request , response) => {

    try{

        const {id : userId} = request.user
        const {index , personId} = request.query
    
        if(userId && (index === 0 || index) && personId){
        
            const [user , person] = await Promise.all([
                await User.findOne({_id : userId}),
                await User.findOne({_id : personId})
             ])
            const check = user.notifications.some(person => person.person._id == personId)

            if(check){

                const filteredRequestUser = person.requestedUsers.filter(requestUsersId => requestUsersId != userId)
                user.notifications.splice(index , 1)
                person.requestedUsers = filteredRequestUser

                await user.save()
                await person.save()

                response.status(200).json({success : true , message : "Successfully ignored"})
                
            }else{
                response.status(400).json({success : false , message : "User already removed"})
            }
    
    
        }

    }catch(error){
        response.status(500).json({error : "Server error"})
    }

}

//controller for clear notifications
export const clearNotificationController = async (request , response) => {

    try{

        const {id : userId} = request.user

        if(userId){

            const user = await User.findOne({_id : userId})
            user.notifications = []

            await user.save()

            response.status(200).json({success : true , message : "Notifications cleared"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("clearNotification controller error : " + error)
        
    }

}