import { compare, hash } from 'bcrypt'
import { db } from '../configs/db.configs'
import type { ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service for get  user's data
const GetUserData = async (authenticatedUserid: number): Promise<ServiceResponse> => {
  try {
    // get the user data from db
    const userData = await db.query('SELECT userid,username,email,role,createat FROM users WHERE users.userid = $1', [
      authenticatedUserid
    ])

    if (userData.rowCount <= 0) {
      return {
        success: false,
        message: 'No user found'
      }
    }

    return {
      success: true,
      message: 'Get User Data successfull',
      data: userData.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while getting user data')
    return {
      success: false,
      message: 'Error occured while getting user data'
    }
  }
}

// service for updating user's userame
const UpdateUsername = async (authenticatedUserId: number, newUsername: string): Promise<ServiceResponse> => {
  try {
    const updateStatus = await db.query(
      'UPDATE users SET username = $1 WHERE users.userid = $2 RETURNING userid,username,email',
      [newUsername, authenticatedUserId]
    )

    if (updateStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Error while updating username'
      }
    }

    return {
      success: true,
      message: 'Updated username Successfully',
      data: updateStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating username')
    return {
      success: false,
      message: 'Error while updating username'
    }
  }
}

// service for updating user's email
const UpdateEmail = async (authenticatedUserId: number, newEmail: string): Promise<ServiceResponse> => {
  try {
    const updateStatus = await db.query(
      'UPDATE users SET email = $1 WHERE users.userid = $2 RETURNING userid,username,email',
      [newEmail, authenticatedUserId]
    )

    if (updateStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Error while updating email'
      }
    }

    return {
      success: true,
      message: 'Updated email Successfully',
      data: updateStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating user email')
    return {
      success: false,
      message: 'Error while updating email'
    }
  }
}

// service for updating user's password
const UpdatePassword = async (
  authenticatedUserId: number,
  oldPassword: string,
  newPassword: string
): Promise<ServiceResponse> => {
  try {
    // get original password hash from db
    const originalUserPassData = await db.query('SELECT password,salt FROM users WHERE users.userid = $1', [
      authenticatedUserId
    ])

    if (originalUserPassData.rowCount <= 0) {
      return {
        success: false,
        message: 'Error while updating password'
      }
    }

    const originalPasswordHash: string = originalUserPassData.rows[0].password
    const originalSalt: string = originalUserPassData.rows[0].salt

    // first comparing old password
    const isVerified: boolean = await compare(oldPassword, originalPasswordHash)

    if (!isVerified) {
      return {
        success: false,
        message: 'Old Password incorrect'
      }
    }

    // now prepare new password hash with old salt and new password
    const newHashedPassword: string = await hash(newPassword, originalSalt)

    // update db user password
    const updateStatus = await db.query(
      'UPDATE users SET password = $1 WHERE users.userid = $2 RETURNING userid,username,email',
      [newHashedPassword, authenticatedUserId]
    )

    if (updateStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Error while updating password'
      }
    }

    return {
      success: true,
      message: 'Updated Password successfully',
      data: updateStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error whil updating user password')
    return {
      success: false,
      message: 'Error while updating password'
    }
  }
}

// service for deleting user
const DeleteUser = async (authenticatedUserId: number, password: string): Promise<ServiceResponse> => {
  try {
    // first get the user for db
    const originalUserPassData = await db.query('SELECT password FROM users WHERE users.userid = $1', [
      authenticatedUserId
    ])

    if (originalUserPassData.rowCount <= 0) {
      return {
        success: false,
        message: 'Error while deleting user'
      }
    }
    const originalPasswordHash: string = originalUserPassData.rows[0].password

    // then comparing the password
    const isVerified: boolean = await compare(password, originalPasswordHash)

    if (!isVerified) {
      return {
        success: false,
        message: 'Password is invalid'
      }
    }

    // here delete user accoutn from db
    const deleteStatus = await db.query('DELETE FROM users WHERE users.userid = $1 RETURNING userid, username, email', [
      authenticatedUserId
    ])

    if (deleteStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Error while deleting user'
      }
    }

    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: 'Successfully deleted user account',
      data: deleteStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while deleting user')
    return {
      success: false,
      message: 'Error while deleting user'
    }
  }
}

export { GetUserData, UpdateUsername, UpdateEmail, UpdatePassword, DeleteUser }
