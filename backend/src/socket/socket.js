export const socketHandler = (io) => {

  let onlineUsers = []
  const typingUsers = {
    from : null,
    to : null
  }

  io.on("connection", (socket) => {

    //set online users
    socket.on("online-users" , (userId) => {

      if(userId){

        socket.userId = userId

        if(!onlineUsers.includes(userId)){
          onlineUsers.push(userId)
        }

        io.emit("get-online-users" , onlineUsers)
      }
      

    })

    //for showing "typing" label
    socket.on("typingUser" , (typingUserId , receiverId) => {
      
      if(typingUserId && receiverId){

        typingUsers.from = typingUserId
        typingUsers.to = receiverId

      }
      
      io.emit("get-typingUsers" , typingUsers)

    })

    //for removing typing user
    socket.on("remove-typingUser" , (typingUserId) => {
      
      if(typingUserId){

        typingUsers.from = null

      }

      io.emit("get-typingUsers" , typingUsers)

    })

    //send message
    socket.on("send-message", (messageData) => {
            
      io.emit("receive-message", messageData)

    })

    //disconnect
    socket.on("disconnect" , () => {
      
      const disconnectUserId = socket.userId

      if(disconnectUserId){

        const filteredOnlineUsers = onlineUsers.filter(onlineUsersId => onlineUsersId != disconnectUserId)
        onlineUsers = filteredOnlineUsers

        io.emit("get-online-users" , onlineUsers)

      }

    })

  })

}
