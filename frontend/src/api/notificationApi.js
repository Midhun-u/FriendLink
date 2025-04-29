import axiosInstance from "./axiosInstance"

//function for get notification api
export const getNotification = async (page = 1) => {

    const response = (await axiosInstance.get(`/notification/getNotification/?page=${page}`)).data
    return response

}

//function for adding user
export const addUser = async (personId , index) => {

    if(personId && (index === 0 || index)){
        const response = (await axiosInstance.post(`/notification/addUser/${personId}/?index=${index}`)).data
        return response
    }

}

//function for ignore people
export const ignorePeople = async (index , personId) => {
    
        if((index === 0 || index) && personId){
            const response = (await axiosInstance.put(`/notification/ignore/?index=${index}&personId=${personId}`)).data
            return response
        }

}

//function for clear notifications
export const clearNotificationsApi = async () => {

    const response = await axiosInstance.put("/notification/clearNotifications")
    return response.data

}