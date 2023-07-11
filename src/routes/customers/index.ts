import { Router, type IRouter } from 'express'
import { LogoutRouter } from './logout.route'
import { UserRouter } from './user.route'
import { CartRouter } from './cart.route'
import { ReviewCustomerRouter } from './reviews.customer.route'

const router: IRouter = Router()

router.use('/logout', LogoutRouter)

router.use('/users', UserRouter)

router.use('/carts', CartRouter)

router.use('/reviews', ReviewCustomerRouter)

export { router as CustomerRouter }
