import { type Request, type Response, type NextFunction } from 'express'
import { GetUserData, type UserDataInfo } from '../services/user.service'
import { StatusCodes } from 'http-status-codes'

// controller for get the user data
const GetOneUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const getUserDataStatus: UserDataInfo = await GetUserData(authenticatedUserId)

    if (!getUserDataStatus.success) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        ...getUserDataStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...getUserDataStatus
    })
  } catch (err) {
    console.log(err)
    next(err)
    console.log('Error while gettig user data')
  }
}

export { GetOneUserData }
