import express from 'express'
import { body, param } from 'express-validator'
import passport from '../configs/passport.config'
import {
  AddOneCart,
  GetOneAllCart,
  RemoveAllOneCart,
  RemoveSingleOneCart,
  UpdateOneCart
} from '../controllers/cart.controller'

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

router.patch(
  '/:cartid',
  param('cartid')
    .notEmpty()
    .withMessage('Param cartid should not be empty')
    .isNumeric()
    .withMessage('Param cartid should be an integer'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity should ot be empty')
    .isNumeric()
    .withMessage('Quantity should be an integer'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneCart
)

router.delete(
  '/',
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveAllOneCart
)

router.delete(
  '/:cartid',
  param('cartid').isNumeric().withMessage('Param cartid should be an integer'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveSingleOneCart
)

export { router as CartRouter }
