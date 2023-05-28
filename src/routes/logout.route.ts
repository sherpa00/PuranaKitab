import express from 'express'
import { LogOutOne } from '../controllers/logout.controller'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', LogOutOne)

export { router as LogoutRouter }
