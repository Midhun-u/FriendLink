import {connect} from 'mongoose'

//function for connecting database
const connectDatabase = async () => {

    try{

        const connection = await connect(process.env.MONGODB_URL)
        console.log("Database connected : " + connection.connection.host)

    }catch(error){
        console.log("Database is not connected : " + error)
    }

}

export default connectDatabase