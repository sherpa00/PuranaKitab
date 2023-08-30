import express from 'express'
import { body } from 'express-validator'
import { forgotPasswordAccountLimit } from '../../utils/rateLimiters'
import { ForgotPasswordOne } from '../../controllers/forgot-password.controller'

const router = express.Router()

if (process.env.NODE_ENV !== 'testing') {
  router.post(
    '/',
    body('email')
      .notEmpty()
      .withMessage('Email Body should not be empty')
      .isEmail()
      .withMessage('Should use correct email'),
    // rate limiter for prod and dev
    forgotPasswordAccountLimit,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ForgotPasswordOne
  )
} else {
  router.post(
    '/',
    body('email')
      .notEmpty()
      .withMessage('Email Body should not be empty')
      .isEmail()
      .withMessage('Should use correct email'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ForgotPasswordOne
  )
}

export { router as ForgotPasswordRouter }
