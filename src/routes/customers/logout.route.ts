import express from 'express'
import passport from '../../configs/passport.config'
import { logoutAccountLimit } from '../../utils/rateLimiters'
import { LogOutOne } from '../../controllers/logout.controller'

const router = express.Router()

if (process.env.NODE_ENV !== 'testing') {
  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    // rate limiter for prod and dev
    logoutAccountLimit,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    LogOutOne
  )
} else {
  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    LogOutOne
  )
}

export { router as LogoutRouter }
