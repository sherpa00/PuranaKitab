import passport from 'passport'
import * as dotenv from 'dotenv'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { type Secret, type JwtPayload } from 'jsonwebtoken'
import { type Request } from 'express'
import { db } from './db.configs'
import logger from '../utils/logger.utils'

// type for userdata;
export interface userPayload {
  userid: number
  email: string
  username: string
  role: string
}

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET: Secret = process.env.SECRET!

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
      passReqToCallback: true
    },
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (req: Request, payload: JwtPayload, done: any): Promise<void> => {
      try {
        // find the user
        const foundUser = await db.query(
          'SELECT userid,username,email,role,createat,last_logout FROM users WHERE userid = $1 AND password = $2',
          [payload.sub, payload.subPass]
        )

        if (foundUser.rowCount <= 0) {
          done(null, false, { message: 'User not found' })
          return
        }

        // comparing issuedat and last_logout for logout verification

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const jwtIssuedAt = payload.iat ? new Date(payload.iat * 1000) : null // null check

        const lastLogOut = new Date(foundUser.rows[0].last_logout)

        // check if token created after last logout time (valid) or before (invalid)
        if (jwtIssuedAt != null && jwtIssuedAt < lastLogOut) {
          done(null, false, { message: 'TOKEN INVALID ' })
          return
        }

        // assign req.user to userdata
        const userData: userPayload = {
          userid: foundUser.rows[0].userid,
          email: foundUser.rows[0].email,
          username: foundUser.rows[0].username,
          role: foundUser.rows[0].role
        }

        req.user = foundUser.rows[0].userdata
        done(null, userData, { message: 'Logged in' })
      } catch (err) {
        logger.error(err, 'Error while passport configs')
      }
    }
  )
)

export default passport
