import express, { type IRouter } from 'express'
import { body } from 'express-validator'
import { PlaceOrderOfflineOne } from '../../controllers/orders.controller'

const router: IRouter = express.Router()

router.post(
    '/place-order',
    body('carts')
        .notEmpty().withMessage('Body carts should not be empty')
        .isArray().withMessage('carts should be an array of cartids'),
    body('phone_number')
        .notEmpty().withMessage('Body Phone Number should not be empty')
        .isMobilePhone('ne-NP').withMessage('Body Phone number should be valid phone number'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    PlaceOrderOfflineOne
)

export {router as OrdersRouter}