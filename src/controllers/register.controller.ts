import { type Request, type Response, type NextFunction } from 'express'
import RegisterNewUser, { type InewUser } from '../services/register.service'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'
import type { ServiceResponse } from '../types'

const registerOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // input validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    const requestBody: InewUser = req.body
    // trigger user service register
    const registerStatus: ServiceResponse = await RegisterNewUser(requestBody)

    if (!registerStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...registerStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Successfully Registered New User'
    })
  } catch (err) {
    next(err)
  }
}

export default registerOne
