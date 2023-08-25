import express, { type IRouter } from 'express'
import { body } from 'express-validator'
import { PlaceOrderOfflineOne, PlaceOrderOnlineOne, ShowMyOrdersOne } from '../../controllers/orders.controller'
import passport from '../../configs/passport.config'

const router: IRouter = express.Router()

router.get(
  '/my-orders',
  // customer user authentication and authorization
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ShowMyOrdersOne
)

router.post(
  '/place-order/offline',
  body('carts')
    .notEmpty()
    .withMessage('Body carts should not be empty')
    .isArray()
    .withMessage('carts should be an array of cartids'),
  body('phone_number')
    .notEmpty()
    .withMessage('Body Phone Number should not be empty')
    .isMobilePhone('ne-NP')
    .withMessage('Body Phone number should be valid phone number'),
  // customer user authentication and authorization
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  PlaceOrderOfflineOne
)

router.post(
  '/place-order/online',
  body('carts')
    .notEmpty()
    .withMessage('Body carts should not be empty')
    .isArray()
    .withMessage('carts should be an array of cartids'),
  body('phone_number')
    .notEmpty()
    .withMessage('Body Phone Number should not be empty')
    .isMobilePhone('ne-NP')
    .withMessage('Body Phone number should be valid phone number'),
  body('card_details')
    .notEmpty()
    .withMessage('Card details should not be empty')
    .isObject()
    .withMessage('Card should be valid'),
  body('card_details.creditCard')
    .notEmpty()
    .withMessage('Credit card number should be given')
    .isString()
    .withMessage('Credit card number should a string'),
  body('card_details.expMonth')
    .notEmpty()
    .withMessage('Credit card expiry month should be given')
    .isInt()
    .withMessage('Credit card expiry month should a integer'),
  body('card_details.expYear')
    .notEmpty()
    .withMessage('Credit card expiry year should be given')
    .isInt()
    .withMessage('Credit card expiry year should a integer'),
  body('card_details.cvc')
    .notEmpty()
    .withMessage('Credit card cvc should be given')
    .isString()
    .withMessage('Credit card cvc should a string'),
  // customer user authentication and authorization
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  PlaceOrderOnlineOne
)

export { router as OrdersCustomerRouter }
