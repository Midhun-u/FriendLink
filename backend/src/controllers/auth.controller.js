import { generateToken } from "../utilities/generateToken.js"
import User from "../models/user.model.js"
import uploadAsset from "../config/cloudinary.js"
import sendOtp from "../config/nodemailer.js"
import { hashPassword , comparePassword} from "../utilities/hashPassword.js"

//controller for sign
export const signController = async (request , response) => {

    try{

        const {fullName , email , password} = request.body

        if(fullName && email && password){

            //check user already exists
            const checkUser = await User.findOne({email : email})

            if(checkUser){

                response.status(400).json({success : false , message : "Email already exists"})

            }else{

                //hashing password before save
                const hashedPassword = await hashPassword(password)

                if(password.length >= 6){

                    const newUser = await User.create({
                        fullName : fullName,
                        email : email,
                        password : hashedPassword,
                        authType : "Email"
                    })

                    if(newUser){

                        //generate token function
                        generateToken(newUser._id , newUser.fullName , newUser.email , response)

                        response.status(201).json({success : true , message : "Account created"})
                    }

                }else{
                    response.status(400).json({success : false , message : "Password must be atleast 6 or above"})
                }

            }

        }else{

            response.status(400).json({success : false , message : "All fields are required"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})

        console.log("sign controller error : " + error)
    }

}

//controller for google sign
export const googleSignController = async (request ,response) => {

    try{

        const {email , fullName , profilePic} = request.body

        if(email && fullName){

            //check email already exists
            const checkUser = await User.findOne({email : email})

            if(checkUser){

                response.status(400).json({success : false , message : "Email already exits"})

            }else{

                let imageUrl = null

                if(profilePic){

                    //function for upload image in cloudinary
                    imageUrl = await uploadAsset(profilePic , "image")

                }

                const newUser = await User.create({
                    fullName : fullName,
                    email : email,
                    profilePic : imageUrl,
                    authType : "google"
                })

                if(newUser){

                    //generate token function
                    generateToken(newUser._id , newUser.fullName , newUser.email , response)

                    response.status(201).json({success : true , message : "Account created"})

                }

            }

        }else{

            response.status(400).json({success : false , message : "All fields are required"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("googlesign controller error : " + error)

    }

}

//controller for login
export const loginController = async (request , response ) => {

    try{

        const {email , password} = request.body

        if(email && password){

            //check email registered
            const user = await User.findOne({email : email , authType : "Email"})

            if(user){

                //check password is correct
                const checkPassword = await comparePassword(password , user.password)

                if(checkPassword){

                    //generate token function
                    generateToken(user._id , user.fullName , user.email , response)

                    response.status(200).json({success : true , message : "Login success"})

                }else{

                    response.status(400).json({success : false , message : "Password is incorrect"})

                }

            }else{

                response.status(400).json({success : false , message : "Email is not registered"})

            }

        }else{

            response.status(400).json({success : false , message : "All fields are required"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("login controller error : " + error)

    }

}

//controller for google login
export const googleLoginController = async (request , response) => {

    try{

        const {email} = request.body

        if(email){

            const user = await User.findOne({email : email , authType : "google"}) //check user signed

            if(user){

                //generate token function
                generateToken(user._id , user.fullName , user.email , response)

                response.status(200).json({success : true , message : "Login success"})

            }else{

                response.status(400).json({success : false , message : "Email is not registered"})

            }

        }else{

            response.status(400).json({success : false , message : "All fields are required"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("google login controller error : " + error)

    }

} 

//controller for logout
export const logoutController = async (request , response) => {

    try{

        response.clearCookie("token")
        response.status(200).json({success : true , message : "Logout success"})

    }catch(error){

        console.log("logout controller error : " + error)
        response.status(500).json({error : "Server error"})

    }

}

//controller for check user authenticated
export const profileController = async (request , response) => {

    try{

        const {id} = request.user

        if(id){

            const profile = await User.findOne({_id : id}).select("-password")

            response.status(200).json({success : true , profile : profile})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("profileController error : " + error)

    }

}

//controller for send otp
export const sendOtpController = async (request , response) => {

    try{

        const {email} = request.body


        if(email){

            //check email is signed)
            const checkUser = await User.findOne({email : email , authType : "Email"})

            if(checkUser){

               const otp = Math.round(1000 + Math.random() * 9000).toString() //generate 4 digit otp
               const expireDate = Date.now() + 5 * 60 * 1000  //generate expire data
               
               const otpData = {
                otpDigits : otp,
                expireDate : expireDate
               }

               sendOtp(email , otp) //function for send otp via email

               response.status(200).json({success : true , message : "OTP send to the Email" , userEmail : checkUser.email , otpData : otpData})
               

            }else{

                response.status(400).json({success : false , message : "Email is not found"})

            }

        }else{

            response.status(400).json({success : false, message : "Email is required"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("sendotp controller error : " + error)

    }

}

//controller for changing password
export const changePasswordController = async (request , response) => {

    try{

        const {newPassword , email} = request.body

        if(newPassword && email){

            //check user
            const checkUser = await User.findOne({email : email , authType : "Email"})

            if(checkUser){

                const hashedPassword = hashPassword(newPassword)

                checkUser.password = hashedPassword
                checkUser.save()

                response.status(200).json({success : true , message : "Password changed"})

            }else{
                response.status(400).json({success : false , message : "Email is not registered"})
            }

        }else{
            response.status(400).json({success : false , message : "All fields are required"})
        }

    }catch(error){
        response.status(500).json({error : "Server error"})
        console.log("change password controller error")
    }

}

//controller for changing profile
export const changeProfileController = async (request , response) => {

    try{

        const {fullName , bio , gender , profilePic} = request.body
        const {id : userId} = request.user

        if(fullName || bio || gender){

            const user = await User.findOne({_id : userId})

            if(user){


                if(profilePic && profilePic !== user.profilePic){

                   const imageUrl = await uploadAsset(profilePic , "image")
                    
                   user.fullName = fullName
                   user.bio = bio
                   user.gender = gender
                   user.profilePic = imageUrl

                   await user.save()

                   response.status(200).json({success : true , message : "Profile updated"})

                }else{

                    user.fullName = fullName
                    user.bio = bio
                    user.gender = gender

                    await user.save()

                    response.status(200).json({success : true , message : "Profile updated"})

                }

            }else{
                response.status(400).json({success : false , message : "User not found"})
            }

        }else{

            response.status(400).json({success : false , message : "All fields are required"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("changeProfile controller error : " + error)

    }

}

//controller for change current password
export const changeCurrentPasswordController = async (request ,response) => {

    try{

        const {currentPassword , newPassword} = request.body
        const {id : userId} = request.user

        if(currentPassword && newPassword){

            if(newPassword.length >= 6){
                
                const user = await User.findOne({_id : userId , authType : "Email"})
                
                if(user){
    
                    const checkPassword = await comparePassword(currentPassword , user.password) //check password
                    
                    if(checkPassword){
    
                        const hashedPassword = await hashPassword(newPassword) //hashing password
                        const updatePassword = await User.updateOne({_id : userId} , {password : hashedPassword})
    
                        if(updatePassword.acknowledged && updatePassword.modifiedCount){
    
                            response.status(200).json({success : true , message : "Password is changed"})
    
                        }
    
                    }else{
    
                        response.status(400).json({success : false , message : "Password is incorrect"})
    
                    }
    
                }else{
                    response.status(400).json({success : false , message : "User not found"})
                }
            }else{
                response.status(400).json({success : false , message : "Password must be 6 letters or above"})
            }

        }else{

            response.status(400).json({success : false, message : "Fields are missing"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("changeCurrentPassword controller error : " + error)

    }

}