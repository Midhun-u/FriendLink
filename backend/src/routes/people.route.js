import { Router } from 'express'
import { protectMiddleware } from '../middlewares/protectMiddleware.js'
import { sendRequestController, getUsersController, removePersonController, removeRequestController, blockUserController, unblockUserController, getBlockedUsersController } from '../controllers/people.controller.js'

const peopleRouter = Router()

//route for getting people
peopleRouter.get("/getUsers", protectMiddleware, getUsersController)

//route for sending request
peopleRouter.post("/sendRequest/:id", protectMiddleware, sendRequestController)

//route for remove person
peopleRouter.delete("/remove-person/:personId", protectMiddleware, removePersonController)

//route for remove request
peopleRouter.delete("/remove-request/:personId", protectMiddleware, removeRequestController)

//route for block user
peopleRouter.post("/block-user/:personId", protectMiddleware, blockUserController)

//route for unblock user
peopleRouter.post("/unblock-user/:personId", protectMiddleware, unblockUserController)

//route for get blocked people
peopleRouter.get("/get-blockedUsers", protectMiddleware, getBlockedUsersController)

export { peopleRouter }