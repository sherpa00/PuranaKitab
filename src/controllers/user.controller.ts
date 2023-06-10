import { type Request, type Response, type NextFunction } from 'express'
import {
  DeleteUser,
  GetUserData,
  UpdateEmail,
  UpdatePassword,
  UpdateUsername,
} from '../services/user.service'
import { StatusCodes } from 'http-status-codes'
import type { ServiceResponse } from '../types'

// controller for get the user data
const GetOneUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const getUserDataStatus: ServiceResponse = await GetUserData(authenticatedUserId)

    if (!getUserDataStatus.success) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        ...getUserDataStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...getUserDataStatus
    })
    return
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

    const updateUsernameStatus: ServiceResponse = await UpdateUsername(authenticatedUserId, req.body.newusername)

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
    next(err)
  }
}

const UpdateOneEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const updateEmailStatus: ServiceResponse = await UpdateEmail(authenticatedUserId, req.body.newemail)

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
    next(err)
  }
}

const UpdateOnePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const updatePasswordStatus: ServiceResponse = await UpdatePassword(
      authenticatedUserId,
      req.body.oldpassword,
      req.body.newpassword
    )

    if (!updatePasswordStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...updatePasswordStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...updatePasswordStatus
    })
  } catch (err) {
    next(err)
  }
}

const DeleteOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get the authenticated userid
    const authenticatedUserData: any = req.user
    const authenticatedUserId: number = authenticatedUserData.userid

    const deleteStatus: ServiceResponse = await DeleteUser(authenticatedUserId, req.body.password)

    if (!deleteStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...deleteStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...deleteStatus
    })
  } catch (err) {
    console.log('Error while deleting user')
  }
}

export { GetOneUserData, UpdateOneUsername, UpdateOneEmail, UpdateOnePassword, DeleteOneUser }
