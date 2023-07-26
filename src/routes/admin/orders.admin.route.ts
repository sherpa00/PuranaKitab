import express, { type IRouter } from 'express'
import { param } from 'express-validator'
import { ConfirmOrdersOne } from '../../controllers/orders.controller'


const router: IRouter = express.Router()

router.get(
    '/confirm-order/:orderid',
    param('orderid')
        .notEmpty().withMessage('Param orderid should not be empty')
        .isInt().withMessage('Param orderid must be integer'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ConfirmOrdersOne
)

export {router as OrdersAdminRouter}