
import nodemailer, { type Transporter } from 'nodemailer'
import * as dotenv from 'dotenv'
import logger from '../utils/logger.utils'

dotenv.config()

export interface SendResetEmailStatus {
    success: boolean
    message: string
}

// function to send reset email
const sendResetEmail = async (receiverEmail: string, token: string): Promise<SendResetEmailStatus> => {
    try {

        const resetLink: string = `http://localhost:3003/forgot-password/${token}`

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.DEFAULT_EMAIL,
              pass: process.env.DEFAULT_EMAIL_PASSWORD,
            },
          });

        const msgOptions = {
            from: process.env.DEFAULT_EMAIL,
            to: receiverEmail,
            subject: 'PASSWORD RESET',
            text: 'Sending reset password link',
            html: `You requested reset passoword so please visit ${resetLink} to reset password.`
        }

        // send email
        await transporter.sendMail(msgOptions)
        
        return {
            success: true,
            message: 'Successfully sent reset email'
        }

    } catch (err) {
        logger.error('Error while sending reset email', err)
        console.log(err)
        return {
            success: false,
            message: 'Error while sending reset email'
        }
    }
}

export default sendResetEmail