import express from 'express'
import LoginOne from '../controllers/login.controller'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', LoginOne)

export { router as loginRouter }
