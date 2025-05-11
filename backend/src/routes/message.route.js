import { Router } from "express"
import { protectMiddleware } from "../middlewares/protectMiddleware.js"
import { getAddedUsersController, getMessageController, sendMessageController } from "../controllers/message.controller.js"

const messageRouter = Router()

//route for get added users
messageRouter.get("/getAddedUsers" , protectMiddleware , getAddedUsersController)

//route for send message
messageRouter.post("/sendMessage/:receiverId" , protectMiddleware , sendMessageController)

//route for get messages
messageRouter.get("/getMessage/:receiverId" , protectMiddleware , getMessageController)

//route for generate stream toke
messageRouter.get("/get-streamToken" , protectMiddleware , )

export {messageRouter}