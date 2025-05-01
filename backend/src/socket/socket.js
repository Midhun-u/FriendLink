export const socketHandler = (io) => {

  const onlineUsers = []

  io.on("connection", (socket) => {

    socket.on("send-message", (messageData) => {
            
      socket.emit("receive-message", messageData)

    })

  })

}