import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import connectDatabase from './config/db.js'
import { authRoute } from './routes/auth.route.js'
import { messageRouter } from './routes/message.route.js'
import { peopleRouter } from './routes/people.route.js'
import { notificationRouter } from './routes/notification.route.js'
import {Server} from 'socket.io'
import {socketHandler} from './socket/socket.js'
import 'dotenv/config'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

//middlewares
app.use(express.json({limit : "1024mb"}))
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors({
    origin : process.env.CLIENT_URL, 
    credentials : true , 
    methods : ["GET" , "POST" , "DELETE" , "PUT"]}
))

//middleware route for authentication
app.use("/api/auth" , authRoute)
//middleware route for message
app.use("/api/message" , messageRouter)
//middleware route for people
app.use("/api/people" , peopleRouter)
//middleware route for notification
app.use("/api/notification" , notificationRouter)

//socket connection
const io = new Server(server , {
    cors : {
        origin : process.env.CLIENT_URL,
        methods : ["GET" , "POST" , "PUT" , "DELETE"]
    }
})

socketHandler(io)

server.listen(PORT , () => {

    //function for connecting database
    connectDatabase()

    console.log(`Server running on ${PORT} port`)
})

export default app