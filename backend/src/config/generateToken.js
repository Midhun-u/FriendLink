import jwt from "jsonwebtoken"

//function for generate token
export const generateToken = async (userId , name , email , response) => {

    if(userId && email && name && response){

        const token = jwt.sign({id : userId , name : name , email : email} , process.env.JWT_SECRET , {expiresIn : "30d"})

        response.cookie("friendLink" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            maxAge : 30 * 24 * 60 * 60 * 1000 //for 30 days
        })

    }

}