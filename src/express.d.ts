import { type userPayload } from './configs/passport.config'

declare global {
  namespace Express {
    interface Request {
      user?: userPayload
    }
  }
}
