import { hash } from 'bcrypt'
import { db } from '../configs/db.configs'
import { type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service to reset password with reset link
const ResetPassword = async (resetToken: string, newPassword: string): Promise<ServiceResponse> => {
  try {
    // verify that reset token exits and is not expired
    const foundResetToken = await db.query(
      'SELECT email FROM reset_tokens WHERE reset_tokens.token = $1 AND reset_tokens.expiry_date > NOW()',
      [resetToken]
    )

    if (foundResetToken.rowCount <= 0) {
      return {
        success: false,
        message: 'Reset Token Invalid or Expired'
      }
    }

    // then verify if user exists for token realated email
    const foundUser = await db.query('SELECT userid,username,salt,email FROM users WHERE users.email = $1', [
      foundResetToken.rows[0].email
    ])

    if (foundUser.rowCount <= 0) {
      return {
        success: false,
        message: 'No User Account Found'
      }
    }

    // old user password salt
    const originalSalt: string = foundUser.rows[0].salt

    // hash new password with old salt
    const newHashedPassword: string = await hash(newPassword, originalSalt)

    // update user db
    const updateUserPassword = await db.query(
      'UPDATE users SET password = $1 WHERE users.email = $2 RETURNING userid,username,email',
      [newHashedPassword, foundUser.rows[0].email]
    )

    if (updateUserPassword.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to reset password'
      }
    }

    // remove reset token then
    const removeResetToken = await db.query(
      'DELETE FROM reset_tokens WHERE reset_tokens.token = $1 AND reset_tokens.email = $2 RETURNING email',
      [resetToken, foundUser.rows[0].email]
    )

    if (removeResetToken.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to reset password'
      }
    }

    return {
      success: true,
      message: 'Successfully reset password'
    }
  } catch (err) {
    logger.error(err, 'Error while resetting password')
    return {
      success: false,
      message: 'Failed to reset password'
    }
  }
}

export { ResetPassword }
