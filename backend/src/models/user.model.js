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
    blockUsers : {
        type : Array,
        default : []
    },
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

//mongoose middleware for hashing password
userSchema.pre("save" , async function(next){

    if(this.isModified("password") && this.password){

        const salt = await bcrypt.genSalt(10) //generate salt
        this.password = await bcrypt.hash(this.password , salt) //hashing password

        next()
    }else{
        next()
    }


})

//method for comparing password
userSchema.methods.comparePassword = async function(candidatePassword){

    if(candidatePassword){

        const isPasswordCorrect = await bcrypt.compare(this.password , candidatePassword)

        return isPasswordCorrect

    }

}

const User = model("User" , userSchema)

export default User