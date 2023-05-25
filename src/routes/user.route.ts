import express from 'express'
import {
  DeleteOneUser,
  GetOneUserData,
  UpdateOneEmail,
  UpdateOnePassword,
  UpdateOneUsername
} from '../controllers/user.controller'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', GetOneUserData)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/username', UpdateOneUsername)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/email', UpdateOneEmail)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/password', UpdateOnePassword)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/', DeleteOneUser)

export { router as UserRouter }
