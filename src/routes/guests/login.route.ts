import express from 'express'
import { body } from 'express-validator'
import LoginOne from '../../controllers/login.controller'
import { loginAccountLimit } from '../../utils/rateLimiters'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
if (process.env.NODE_ENV !== 'testing') {
  router.post(
    '/',
    body('email').notEmpty().withMessage('Email should not be empty'),
    body('password').notEmpty().withMessage('Password should not be empty'),
    // rate limit for prod and dev
    loginAccountLimit,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    LoginOne
  )
} else {
  router.post(
    '/',
    body('email').notEmpty().withMessage('Email should not be empty'),
    body('password').notEmpty().withMessage('Password should not be empty'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    LoginOne
  )
}

export { router as LoginRouter }
