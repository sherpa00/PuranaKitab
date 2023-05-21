import LoginUser, { type loginPayload } from '../services/login.service'
import { type Request, type Response, type NextFunction } from 'express'
import { type InewUser } from '../services/register.service'
import { StatusCodes } from 'http-status-codes'

const LoginOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestBody: InewUser = req.body

    // triggre login service
    const loginStatus : loginPayload = await LoginUser(requestBody)

    if (!(loginStatus.success)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Username or Password Incorrect'
      })
      next()
      return
    }

    res.status(StatusCodes.OK).json({
      ...loginStatus
    })
    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export default LoginOne
