import { type Request, type Response, type NextFunction } from 'express'
import RegisterNewUser, { type InewUser } from '../services/register.service'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'

const registerOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // input validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const error = new CustomError('Validation Error',403)
      throw error
      /*
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: errors.array()
      })
      return */
    }

    const requestBody: InewUser = req.body
    // trigger user service register
    await RegisterNewUser(requestBody)

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Successfully Registered New User of email: ' + requestBody.email
    })
  } catch (err) {
    next(err)
  }
}

export default registerOne
