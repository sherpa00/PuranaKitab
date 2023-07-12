import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import { type ServiceResponse } from '../../../types'
import { ForgotPassword } from '../../../services/forgot_password.service'
import CustomError from '../../../utils/custom-error'

// controller for forgot password operation
const ForgotPasswordOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const ValidationError = validationResult(req)
    if (!ValidationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // request body
    const { email } = req.body

    // call forgot password service
    const forgotPasswordStatus: ServiceResponse = await ForgotPassword(email)

    if (!forgotPasswordStatus.success) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        ...forgotPasswordStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...forgotPasswordStatus
    })
  } catch (err) {
    next(err)
  }
}

export { ForgotPasswordOne }
