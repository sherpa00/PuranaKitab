import { type Request, type Response, type NextFunction } from 'express'
import { GetUserData, UpdateEmail, UpdateUsername, type UserDataInfo } from '../services/user.service'
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

const UpdateOneUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const updateUsernameStatus: UserDataInfo = await UpdateUsername(authenticatedUserId, req.body.newusername)

    if (!updateUsernameStatus.success) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        ...updateUsernameStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...updateUsernameStatus
    })
  } catch (err) {
    console.log(err)
    next(err)
    console.log('Error while updating username')
  }
}

const UpdateOneEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const updateEmailStatus: UserDataInfo = await UpdateEmail(authenticatedUserId, req.body.newemail)

    if (!updateEmailStatus.success) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        ...updateEmailStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...updateEmailStatus
    })
  } catch (err) {
    console.log(err)
    next(err)
    console.log('Error while updating email')
  }
}

export { GetOneUserData, UpdateOneUsername, UpdateOneEmail }
