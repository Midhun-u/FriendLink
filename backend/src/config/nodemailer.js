import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({

    service : "gmail",
    secure : true,
    auth : {

        user : process.env.USER_EMAIL,
        pass : process.env.USER_PASS

    }

})

//function for send otp to the email
const sendOtp = (email , otp) => {

    const mailOption = {

        from : "FriendLink friendlink@gmail.com",
        to : email,
        subject : "Your One-Time Password (OTP) for Reset Password",
        html : `
        <h1 style="width:100%;display:flex;justify-content:center">
        YOUR OTP : ${otp}
        </h1>
        <p>
            For your security, do not share this OTP with anyone, including our support team. We will never ask for your OTP under any circumstances.
            If you did not request this OTP, please ignore this email or contact our support team immediately.
            Best regards,
            FriendLink
        </p>
        `
    }

    transporter.sendMail(mailOption , (error , info) => {

        if(error){
            console.log("Error in nodemailer : " + error)
        }

    })

}

export default sendOtp