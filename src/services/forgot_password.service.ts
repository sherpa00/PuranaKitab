import { db } from '../configs/db.configs';
import generateResetToken, { type GenTokenStatus } from '../helpers/generateResetToken';
import sendResetEmail, { type SendResetEmailStatus } from '../helpers/sendResetEmail';
import { type ServiceResponse } from '../types';
import logger from '../utils/logger.utils';

// service for forgot password
const ForgotPassword = async (email: string): Promise<ServiceResponse> => {
  try {
    // first verify if user exists with email
    const foundUser = await db.query('SELECT * FROM users WHERE users.email = $1', [email]);

    if (foundUser.rowCount <= 0) {
      return {
        success: false,
        message: 'No Account Found',
      };
    }

    // now generate token
    const tokenStatus: GenTokenStatus = generateResetToken();

    if (!tokenStatus.success) {
      return {
        success: false,
        message: 'Failed with forgot password operation',
      };
    }

    const token: string = String(tokenStatus.token);

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1); // 1 hr expiry

    // add new token to db with expiry of 1hr to verify later
    const addTokenToDb = await db.query(
      'INSERT INTO reset_tokens(email, token, expiry_date) VALUES ($1, $2, $3) RETURNING *',
      [email, token, expireDate],
    );

    if (addTokenToDb.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed with forgot password operation',
      };
    }

    // send email with token
    const sendEmailStatus: SendResetEmailStatus = await sendResetEmail(email, token);

    if (!sendEmailStatus.success) {
      return {
        success: false,
        message: 'Failed with forgot password operation',
      };
    }

    return {
      success: true,
      message: 'Successfully completed forgot password operation! Check your email',
    };
  } catch (err) {
    logger.error(err, 'Error in forgot password operation');
    return {
      success: false,
      message: 'Error in forgot password operation',
    };
  }
};

export { ForgotPassword };
