import {StreamChat} from 'stream-chat'
import 'dotenv/config'


//setup stream
const streamClient = new StreamChat(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
)

//function for generate stream token
const generateStreamToken = async (userId) => {

    try{

        const userIdStr = userId.toString()
    
        if(userIdStr){
    
            //generate stream token
            const token = streamClient.createToken(userIdStr)
            return token
    
        }

    }catch(error){
        console.log("generateStreamToken error : " + error)
    }

}

export {generateStreamToken}