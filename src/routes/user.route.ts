import express from 'express'
import { GetOneUserData, UpdateOneEmail, UpdateOneUsername } from '../controllers/user.controller'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', GetOneUserData)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/username', UpdateOneUsername)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/email', UpdateOneEmail)

export { router as UserRouter }
