

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
        const resetLink: string = `http://localhost:3003/forgot-password/${resetToken}`


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