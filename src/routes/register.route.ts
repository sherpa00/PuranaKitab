import express from 'express'
import { body } from 'express-validator'
import registerOne from '../controllers/register.controller'

const router = express.Router()

router.post(
  '/',
  body('username')
    .notEmpty()
    .withMessage('Username should not empty'),
  body('password')
    .notEmpty()
    .withMessage('Password should not be empty')
    .isLength({ min: 5 })
    .withMessage('Password length should not be less than 5.'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  registerOne
)

export { router as registerRouter }
