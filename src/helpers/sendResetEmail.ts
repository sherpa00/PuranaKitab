import sgMail, { type MailDataRequired } from '@sendgrid/mail'
import * as dotenv from 'dotenv'
import logger from '../utils/logger.utils'

dotenv.config()

export interface SendResetEmailStatus {
    success: boolean
    message: string
}

// sendgrid api
const SENDGRID_API: string = String(process.env.SENDGRID_API_KEY)

// config sendgrid api
sgMail.setApiKey(SENDGRID_API)

// function to send reset email
const sendResetEmail = async (receiverEmail: string, token: string): Promise<SendResetEmailStatus> => {
    try {

        const resetLink: string = `http://localhost:3003/forgot-password/${token}`

        const msgOptions: MailDataRequired = {
            to: receiverEmail,
            from: String(process.env.SENDGRID_DEFAULT_EMAIL),
            subject: 'PASSWORD RESET',
            text: 'here you can reset your password',
            html: `<p>You requested a password reset so please visit this <a href=${resetLink}/>link</a> and note it that it is only valid for 1 hour only. Thank You</p>`
        }

        // send email
        await sgMail.send(msgOptions)

        return {
            success: true,
            message: 'Successfully sent reset email'
        }

    } catch (err) {
        logger.error('Error while sending reset email', err)
        return {
            success: false,
            message: 'Error while sending reset email'
        }
    }
}

export default sendResetEmail