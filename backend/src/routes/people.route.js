import {Router} from 'express'
import { protectMiddleware } from '../middlewares/protectMiddleware.js'
import { sendRequestController } from '../controllers/people.controller.js'
import { getUsersController } from '../controllers/people.controller.js'

const peopleRouter = Router()

//route for getting people
peopleRouter.get("/getUsers" , protectMiddleware , getUsersController)

//route for sending request
peopleRouter.post("/sendRequest/:id" , protectMiddleware , sendRequestController)

export {peopleRouter}