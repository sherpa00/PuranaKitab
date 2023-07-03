import express from 'express'
import {
  DeleteOneUser,
  GetOneUserData,
  UpdateOneEmail,
  UpdateOnePassword,
  UpdateOneUsername
} from '../../controllers/user.controller'
import { body } from 'express-validator'

const router = express.Router()

router.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneUserData
)

router.patch(
  '/username',
  body('newusername')
    .notEmpty()
    .withMessage('Body newusername should not be empty')
    .isString()
    .withMessage('Body username should be a string'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneUsername
)

router.patch(
  '/email',
  body('newemail')
    .notEmpty()
    .withMessage('Body newemail should not be empty')
    .isEmail()
    .withMessage('Body newemail should be a valid email'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneEmail
)

router.patch(
  '/password',
  body('oldpassword')
    .notEmpty()
    .withMessage('Body oldpassword should not be empty')
    .isLength({ min: 5 })
    .withMessage('Body oldpassword length should be greater than 5'),
  body('oldpassword')
    .notEmpty()
    .withMessage('Body newpassword should not be empty')
    .isLength({ min: 5 })
    .withMessage('Body newpassword length should be greater than 5'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOnePassword
)

router.delete(
  '/',
  body('password').notEmpty().withMessage('Body Password should not be empty'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  DeleteOneUser
)

export { router as UserRouter }
