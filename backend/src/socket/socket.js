export const socketHandler = (io) => {

    const onlineUsers = []

    io.on("connection" , (socket) => {

        console.log("user connected id : " + socket.id)

        socket.on("send-message" , (messageData) => {
            
            socket.emit("receive-message" , messageData)

        })

    })

}