import express from 'express'
import { GetOneUserData } from '../controllers/user.controller'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', GetOneUserData)

export { router as UserRouter }
