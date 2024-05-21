require('dotenv').config()
const nodemailer = require("nodemailer");


module.exports = async (email, subject, text) =>{
   console.log("process.env:", process.env) 
    try {

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            post : Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.PASS
            }
            

        });

        await transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: subject,
            text: text

        });
        console.log("Please wait till the admin verifies you")
    }catch(error){
        console.log(error)
    }
}