import express from 'express'
import { body } from 'express-validator'
import { ForgotPasswordOne } from '../controllers/forgot-password.controller'
import { forgotPasswordAccountLimit } from '../utils/rateLimiters'

const router = express.Router()

router.post(
  '/',
  body('email')
    .notEmpty()
    .withMessage('Email Body should not be empty')
    .isEmail()
    .withMessage('Should use correct email'),
  // rate limiter
  forgotPasswordAccountLimit,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ForgotPasswordOne
)

export { router as ForgotPasswordRouter }
