import axiosInstance from "./axiosInstance"

//function for getting users
export const getPeople = async (page = 1) => {

    const response = (await axiosInstance.get(`/people/getUsers/?page=${page}`)).data
    return response

}

//function for send request
export const sendRequest = async (personId) => {

    const response = (await axiosInstance.post(`/people/sendRequest/${personId}`)).data
    return response

}