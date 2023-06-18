import { v4 as uuidv4 } from 'uuid'
import logger from '../utils/logger.utils'

export interface GenTokenStatus {
  success: boolean
  message: string
  token?: string
}

// function to generate random uuid
const generateResetToken = (): GenTokenStatus => {
  try {
    // generate uuid token
    const resetToken = uuidv4()

    return {
      success: true,
      message: 'Successfully generated reset token',
      token: resetToken
    }
  } catch (err) {
    logger.error('Error while generting reset token', err)
    return {
      success: false,
      message: 'Error while genrating reset token'
    }
  }
}

export default generateResetToken
