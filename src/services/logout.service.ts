import { db } from '../configs/db.configs'
import type { ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service for logging out
const LogOut = async (authenticatedUserId: number): Promise<ServiceResponse> => {
  try {
    const currentTimestamp = Date.now() // current timestamp

    // change the last_logout date
    const updateLastLogout = await db.query(
      'UPDATE users SET last_logout = TO_TIMESTAMP($1 / 1000.0) WHERE userid = $2 RETURNING userid,username,email',
      [currentTimestamp, authenticatedUserId]
    )

    if (updateLastLogout.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to logout'
      }
    }

    return {
      success: true,
      message: 'Successfully Logged out'
    }
  } catch (err) {
    logger.error(err, 'Error while loggin out')
    return {
      success: false,
      message: 'Failed to logout'
    }
  }
}

export { LogOut }
