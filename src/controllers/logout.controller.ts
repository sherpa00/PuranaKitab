import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { LogOut } from '../services/logout.service'
import type { ServiceResponse } from '../types'

// controller for logout
const LogOutOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    // call the logout service
    const LogOutStatus: ServiceResponse = await LogOut(authenticatedUserId)

    if (!LogOutStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...LogOutStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...LogOutStatus
    })
  } catch (err) {
    next(err)
  }
}

export { LogOutOne }
