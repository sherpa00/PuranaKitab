import express from 'express'
import passport from '../../configs/passport.config'
import { logoutAccountLimit } from '../../utils/rateLimiters'
import { LogOutOne } from '../../controllers/logout.controller'


const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  // rate limiter
  logoutAccountLimit,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  LogOutOne
)

export { router as LogoutRouter }
