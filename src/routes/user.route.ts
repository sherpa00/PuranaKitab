import express from 'express'
import {
  DeleteOneUser,
  GetOneUserData,
  UpdateOneEmail,
  UpdateOnePassword,
  UpdateOneUsername
} from '../controllers/user.controller'
import passport from '../configs/passport.config'

const router = express.Router()

router.get('/', 
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneUserData
)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/username', UpdateOneUsername)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/email', UpdateOneEmail)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/password', UpdateOnePassword)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/', DeleteOneUser)

export { router as UserRouter }
