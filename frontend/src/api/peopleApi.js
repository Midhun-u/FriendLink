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

//function for remove person 
export const removePerson = async (personId) => {
  
  if(personId){
    
    const response = (await axiosInstance.delete(`/people/remove-person/${personId}`)).data
    return response
    
  }
  
}

//function for remove request
export const removeRequest = async (personId) => {
  
  if(personId){
    
    const response = (await axiosInstance.delete(`/people/remove-request/${personId}`)).data
    
    return response
    
  }
  
}