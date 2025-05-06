import jwt from 'jsonwebtoken'

//protect middleware for authentication
export const protectMiddleware = async (request , response , next) => {

    try{

        const {friendLink} = request.cookies

        if(friendLink){

            const decode = jwt.verify(friendLink , process.env.JWT_SECRET)

            if(decode){

                request.user = decode
                next()

            }else{

                response.status(400).json({success : false , message : "Invalid token" , auth : false})

            }

        }else{

            response.status(400).json({success : false , auth : false , message : "Unauthorized"})

        }
        
    }catch(error){

        response.status(500).json({error : "Server error" , success : false , auth : false})
        console.log("middleware error : " + error)

    }

}