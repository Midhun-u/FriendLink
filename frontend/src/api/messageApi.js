import axiosInstance from "./axiosInstance"

export const getAddedUser = async (page = 1) => {

    const response = (await axiosInstance.get(`/message/getAddedUsers/?page=${page}`)).data
    return response

}

export const sendMessageApi = async (message , receiverId , file) => {

    if(message && receiverId || file && receiverId){

            const response = (await axiosInstance.post(`/message/sendMessage/${receiverId}` , {message : message , file : file})).data
            return response
    }

}

export const getMessageApi = async (receiverId , page = 1) => {

    if(receiverId){

        const response = (await axiosInstance.get(`/message/getMessage/${receiverId}/?page=${page}`)).data
        return response

    }

}

export const getStreamToken = async (userId) => {

    if(userId){

        const response = (await axiosInstance.get("/message/get-streamToken")).data
        return response

    }

}