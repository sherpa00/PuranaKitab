import express from 'express'
import { body } from 'express-validator'
import LoginOne from '../../__tests__/integration/controllers/login.controller'
import { loginAccountLimit } from '../../utils/rateLimiters'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post(
  '/',
  body('email').notEmpty().withMessage('Email should not be empty'),
  body('password').notEmpty().withMessage('Password should not be empty'),
  // rate limiter,
  loginAccountLimit,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  LoginOne
)

export { router as LoginRouter }
