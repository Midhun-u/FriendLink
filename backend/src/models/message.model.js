import {Schema , model} from 'mongoose'

const messageSchema = new Schema({

    sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiver : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : {
        type : String,
        trim : true
    },
    mediaType : {
        type : String,
    },
    mediaURL : {
        type : String
    },
    createdAt : {
        type : Date,
    }

} , {versionKey : false})

const Message = model("Message" , messageSchema)

export {Message}