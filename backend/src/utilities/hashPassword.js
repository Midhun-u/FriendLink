import {genSalt , hash , compare} from 'bcrypt'

//function for hash password
export const hashPassword = async (password) => {

    if(password){
        
        const salt = await genSalt(10) //generate salt
        const hashedPassword = await hash(password , salt)
    
        return hashedPassword

    }

    return

}

//function for check password correct
export const comparePassword = async (candidatePassword , hashedPassword) => {

    if(candidatePassword){

        const isPasswordCorrect = await compare(candidatePassword , hashedPassword)
        return isPasswordCorrect

    }

}