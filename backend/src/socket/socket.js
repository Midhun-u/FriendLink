export const socketHandler = (io) => {

  let onlineUsers = []
  const typingUsers = []

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

    //for show label "typing"
    socket.on("typing-user" , (typingUserId) => {
      
      if(typingUserId && !typingUsers.includes(typingUserId)){
        typingUsers.push(typingUserId)
      }
      io.emit("get-typingUsers" , typingUsers)

    })

    //remove show label "typing"
    socket.on("remove-typing" , (typingUserId) => {

      const index = typingUsers.indexOf(typingUserId)
      typingUsers.splice(index , 1)

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
