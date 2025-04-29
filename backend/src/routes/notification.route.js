import {Router} from 'express'
import { protectMiddleware } from '../middlewares/protectMiddleware.js'
import { addUserController, clearNotificationController, getNotificationController, ignorePeopleController } from '../controllers/notification.controller.js'

const notificationRouter = Router()

//route for get notification
notificationRouter.get("/getNotification/" , protectMiddleware , getNotificationController)

//route for add user
notificationRouter.post("/addUser/:personId" , protectMiddleware , addUserController)

//route for ignore people
notificationRouter.put("/ignore" , protectMiddleware , ignorePeopleController)

//route for clear notifications
notificationRouter.put("/clearNotifications" , protectMiddleware ,  clearNotificationController)

export {notificationRouter}