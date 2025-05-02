import {Router} from 'express'
import { protectMiddleware } from '../middlewares/protectMiddleware.js'
import { sendRequestController , getUsersController , removePersonController, removeRequestController} from '../controllers/people.controller.js'

const peopleRouter = Router()

//route for getting people
peopleRouter.get("/getUsers" , protectMiddleware , getUsersController)

//route for sending request
peopleRouter.post("/sendRequest/:id" , protectMiddleware , sendRequestController)

//route for remove person
peopleRouter.delete("/remove-person/:personId" , protectMiddleware , removePersonController)

//route for remove request
peopleRouter.delete("/remove-request/:personId" , protectMiddleware , removeRequestController)

export {peopleRouter}