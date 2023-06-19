import nodemailer, { type Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import logger from '../utils/logger.utils';

dotenv.config();

export interface SendResetEmailStatus {
  success: boolean
  message: string
}

export interface IMailOptions {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

// function to send reset email
const sendResetEmail = async (receiverEmail: string, resetToken: string): Promise<SendResetEmailStatus> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resetLink: string = `http://localhost:3003/reset-password/${resetToken}`;

    const transporter: Transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.DEFAULT_GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions: IMailOptions = {
      from: String(process.env.DEFAULT_EMAIL),
      to: receiverEmail,
      subject: 'RESET PASSWORD',
      text: 'Reset link is given to reset password',
      html: `<h3>
                You requested a reset password so please visit <a href='${resetLink}'>${resetLink}</a> to reset your password.
                </h3>`,
    };

    // send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Successfully sent reset email',
    };
  } catch (err) {
    logger.error(err, 'Error while sending reset email');
    return {
      success: false,
      message: 'Error while sending reset email',
    };
  }
};

export default sendResetEmail;
