import {Schema , model} from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({

    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    password : {
        type : String,
        minLength : 6
    },
    authType : {
        type : String,
    },
    profilePic : {
        type : String,
        default : null
    },
    bio : {
        type : String,
        default : null
    },
    gender : {
        type : String,
        default : ""
    },
    addedUsers : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],
    blockUsers : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],
    lastMessages : {
        type : Array,
        default : []
    },
    requestedUsers : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],
    notifications : {
        type : Array,
        default : []
    },

} , {timestamps : true , minimize : true , versionKey : false})

const User = model("User" , userSchema)

export default User