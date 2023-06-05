import express from 'express'
import { body } from 'express-validator'
import passport from '../configs/passport.config'
import { AddOneCart, GetOneAllCart } from '../controllers/cart.controller'

const router = express.Router()

// get all cart
router.get(
  '/',
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneAllCart
)

// post new cart
router.post(
  '/',
  body('bookid')
    .notEmpty()
    .withMessage('Bookid should not be empty')
    .isNumeric()
    .withMessage('Bookid should be integer'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity should not be empty')
    .isNumeric()
    .withMessage('Quantity should be integer'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  AddOneCart
)

export { router as CartRouter }
