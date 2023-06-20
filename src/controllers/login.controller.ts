import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import { type InewUser } from '../services/register.service'
import LoginUser, { type loginPayload } from '../services/login.service'
import CustomError from '../utils/custom-error'

const LoginOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // input validation errors
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    const requestBody: Pick<InewUser, 'email' | 'password'> = req.body

    // triggre login service
    const loginStatus: loginPayload = await LoginUser(requestBody)

    if (!loginStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email or Password Incorrect'
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...loginStatus
    })
  } catch (err) {
    next(err)
  }
}

export default LoginOne
