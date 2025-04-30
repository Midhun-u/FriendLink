import axiosInstance from "./axiosInstance"

export const signAuthApi = async (userData) => {

    const {fullName , email , password} = userData

    if(fullName && email && password){

        const response = await axiosInstance.post("/auth/sign" , {fullName : fullName.trim() , email : email.trim() , password : password.trim()})
        const result = await response.data

        return result

    }

}

export const googleAuthApi = async (email , name , profilePic) => {

    if(email && name && profilePic){

        const response = await axiosInstance.post("/auth/google-sign" , {fullName : name , email : email , profilePic : profilePic})
        const result = await response.data

        return result

    }

}

export const loginAuthApi = async (email , password) => {

    if(email && password){

        const response = await axiosInstance.post("/auth/login" , {email : email.trim() , password : password.trim()})
        const result = await response.data

        return result

    }

}

export const googleLoginAuthApi = async (email) => {

    if(email){

        const response = await axiosInstance.post("/auth/google-login" , {email : email})
        const result = await response.data

        return result

    }

}

export const profileApi = async () => {

    const response = await axiosInstance.get("/auth/profile")
    const result = await response.data

    return result

}

export const sendOtpApi = async (email) => {

    if(email){

        const response = await axiosInstance.post("/auth/send-otp" , {email : email})
        const result = await response.data

        return result

    }

}

export const changePassowordApi = async (newPassword , email) => {

    if(newPassword){

        const response = await axiosInstance.put("/auth/change-password" , {newPassword : newPassword , email : email})
        const result = await response.data

        return result

    }

}

export const changeProfileApi = async (fullName , profilePic = null , gender , bio) => {

    if(fullName || gender || bio){

        const response = (await axiosInstance.put("/auth/changeProfile" , {fullName : fullName , profilePic : profilePic , gender : gender , bio : bio})).data
        return response

    }

}