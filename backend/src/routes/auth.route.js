import express from 'express'
import { signController , googleSignController, loginController , logoutController, profileController, googleLoginController, sendOtpController, changePasswordController, changeProfileController, changeCurrentPasswordController} from '../controllers/auth.controller.js'
import { protectMiddleware } from '../middlewares/protectMiddleware.js'
const authRoute = express.Router()

//route for sign
authRoute.post("/sign" , signController)

//route for google sign
authRoute.post("/google-sign" , googleSignController)

//route for login
authRoute.post("/login" , loginController)

//route for logout
authRoute.post("/logout" , logoutController)

//route for google login
authRoute.post("/google-login" , googleLoginController)

//route for send otp 
authRoute.post("/send-otp" , sendOtpController)

//route for user authenticated
authRoute.get("/profile" , protectMiddleware , profileController)

//route for change password
authRoute.put("/change-password" , changePasswordController)

//route for changing profile
authRoute.put("/changeProfile" , protectMiddleware , changeProfileController)

//route for change password with current password
authRoute.put("/change-currentPassword" , protectMiddleware , changeCurrentPasswordController)

export {authRoute}