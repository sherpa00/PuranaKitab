import passport from 'passport'
import * as dotenv from 'dotenv'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { type Secret, type JwtPayload } from 'jsonwebtoken'
import { type Request } from 'express'
import { db } from './db.configs'

// type for userdata;
export interface userPayload {
  userid: number
  email: string
  username: string
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
    async (req: Request, jwtPayload: JwtPayload, done: any): Promise<void> => {
      try {
        // find the user
        const foundUser = await db.query(
          'SELECT * FROM users WHERE userid = $1',
          [jwtPayload.sub]
        )

        // user not found
        if (foundUser.rowCount <= 0) {
          done(null, false, { message: 'user not found' })
        }

        // assign req.user to userdata
        const userData: userPayload = {
          userid: foundUser.rows[0].userid,
          email: foundUser.rows[0].email,
          username: foundUser.rows[0].username
        }

        req.user = foundUser.rows[0].userdata
        done(null, userData, { message: 'Logged in' })
      } catch (err) {
        console.log(err)
      }
    }
  )
)

export default passport
