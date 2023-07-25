import { Router, type IRouter } from 'express'
import { LogoutRouter } from './logout.route'
import { UserRouter } from './user.route'
import { CartRouter } from './cart.route'
import { ReviewCustomerRouter } from './reviews.customer.route'
import { OrdersRouter } from './orders.route'

const router: IRouter = Router()

router.use('/logout', LogoutRouter)

router.use('/users', UserRouter)

router.use('/carts', CartRouter)

router.use('/reviews', ReviewCustomerRouter)

router.use('/orders', OrdersRouter)

export { router as CustomerRouter }
