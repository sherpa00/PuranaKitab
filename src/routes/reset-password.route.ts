import express from "express"
import { body, param } from "express-validator"
import { ResetPasswordOne } from "../controllers/reset-password.controller"

const router = express.Router()

router.post(
    '/:token',
    param('token')
        .notEmpty().withMessage('Param token should not be empty'),
    body('password')
        .notEmpty().withMessage('Body Passoword should not be empty')
        .isLength({ min: 5 })
        .withMessage('Password length should not be less than 5.'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ResetPasswordOne
)

export {router as ResetPasswordRouter}