import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { db } from '../configs/db.configs'
import { type InewUser } from './register.service'
import logger from '../utils/logger.utils'

dotenv.config()

export interface loginPayload {
  success: boolean
  message: string
  token?: string
  data?: any
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PRIVATE_KEY: string = process.env.PRIVATE_KEY!

const LoginUser = async (userInfo: Pick<InewUser, 'email' | 'password'>): Promise<loginPayload> => {
  try {
    // first find if userame exits
    const foundUser = await db.query('SELECT * FROM users WHERE email = $1', [userInfo.email])

    if (foundUser.rowCount <= 0) {
      return {
        success: false,
        message: 'No user found'
      }
    }

    // verify user's password
    const isVerified: boolean = compareSync(userInfo.password, foundUser.rows[0].password)

    if (!isVerified) {
      return {
        success: false,
        message: 'Invalid Password'
      }
    }

    // sign new token with rsa256 algo
    const token: string = sign(
      { sub: foundUser.rows[0].userid, subRole: foundUser.rows[0].role, subPass: foundUser.rows[0].password },
      PRIVATE_KEY,
      {
        expiresIn: '1h',
        algorithm: 'RS256'
      }
    )

    return {
      success: true,
      token,
      data: {
        userid: foundUser.rows[0].userid,
        username: foundUser.rows[0].username,
        email: foundUser.rows[0].email
      },
      message: 'Successfully LoggedIn'
    }
  } catch (err) {
    logger.error(err, 'Error while login in')
    return {
      success: false,
      message: 'Error while login in'
    }
  }
}

export default LoginUser
