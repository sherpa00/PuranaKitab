import Router, { type IRouter } from 'express'
import { GuestRouter } from './guests'
import { CustomerRouter } from './customers'
import passport from '../configs/passport.config'
import { AdminRouter } from './admin'
import { isAdmin } from '../middlewares/admin.middleware'

const router: IRouter = Router()

router.use('/api', GuestRouter)

router.use(
  '/api',
  // customer user authentication and authorization
  passport.authenticate('jwt', { session: false }),
  CustomerRouter
)

router.use(
  '/api',
  // user authorization
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  AdminRouter
)

export { router as RootRouter }
