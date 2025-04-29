import Crypto from "crypto-js"
import 'dotenv/config'

//function for encrypt file
export const encryptFile = (fileURL) => {

    const encryptedFile = Crypto.AES.encrypt(fileURL , process.env.ENCRYPT_FILE_SECRET).toString()

    return encryptedFile

}