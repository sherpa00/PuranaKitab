
import nodemailer, { type Transporter } from 'nodemailer'
import * as dotenv from 'dotenv'
import logger from '../utils/logger.utils'

dotenv.config()

export interface SendResetEmailStatus {
    success: boolean
    message: string
}

// function to send reset email
const sendResetEmail = async (receiverEmail: string, resetToken: string): Promise<SendResetEmailStatus> => {
    try {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const resetLink: string = `http://localhost:3003/reset-password/${resetToken}`

        const transport: Transporter = nodemailer.createTransport({
            host: 'smtp.mailgun.org',
            port: 587,
            secure: false,
            tls: { ciphers: 'SSLv3' },
            auth: {
              user: process.env.MAILGUN_SMTP_LOGIN,
              pass: process.env.MAILGUN_SMTP_PASSWORD
            }
          })

          const mailOptions = {
            from: process.env.MAILGUN_SMTP_LOGIN,
            to: receiverEmail,
            subject: 'RESET PASSWORD',
            text: 'Reset link is given to reset password',
            html: `<p>
                You requested a reset password so please visit <a href='${resetLink}'>${resetLink}</a> to reset your password.
                </p>`
          }

          // send email
          await transport.sendMail(mailOptions)

        return {
            success: true,
            message: 'Successfully sent reset email',
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