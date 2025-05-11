import {StreamVideoClient} from '@stream-io/node-sdk'
import 'dotenv/config'


//setup stream
const streamClient = new StreamVideoClient(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
)

//function for generate stream token
const generateStreamToken = async (userId) => {

    try{

        const userIdStr = userId.toString()
    
        if(userIdStr){
    
            const token = await streamClient.createToken(userIdStr)
            console.log(token)
            return token
    
        }

    }catch(error){
        console.log("generateStreamToken error : " + error)
    }

}

export {generateStreamToken}