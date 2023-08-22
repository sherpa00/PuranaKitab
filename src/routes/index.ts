import Router, { type IRouter } from 'express'
import { GuestRouter } from './guests'
import { CustomerRouter } from './customers'
import { AdminRouter } from './admin'

const router: IRouter = Router()

router.use('/api', GuestRouter)

router.use('/api', CustomerRouter)

router.use('/api', AdminRouter)

export { router as RootRouter }
