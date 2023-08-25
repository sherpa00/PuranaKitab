import express, { type IRouter } from 'express'
import { param } from 'express-validator'
import { ConfirmOrdersOne, RemoveOrderOne } from '../../controllers/orders.controller'
import passport from '../../configs/passport.config'
import { isAdmin } from '../../middlewares/admin.middleware'

const router: IRouter = express.Router()

router.get(
  '/confirm-order/:orderid',
  param('orderid')
    .notEmpty()
    .withMessage('Param orderid should not be empty')
    .isInt()
    .withMessage('Param orderid must be integer'),
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ConfirmOrdersOne
)

router.delete(
  '/:orderid',
  param('orderid')
    .notEmpty()
    .withMessage('Param orderid should not be empty')
    .isInt()
    .withMessage('Param orderid must be integer'),
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveOrderOne
)

export { router as OrdersAdminRouter }
