import { type InewUser } from './register.service'
import { db } from '../configs/db.configs'
import { compareSync } from 'bcrypt'
import { type Secret, sign } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import logger from '../utils/logger.utils'

dotenv.config()

export interface loginPayload {
  success: boolean
  message: string
  token?: string
  data?: any
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET: Secret = process.env.SECRET!

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

    // sign new token
    const token: string = sign(
      { sub: foundUser.rows[0].userid, subRole: foundUser.rows[0].role, subPass: foundUser.rows[0].password },
      SECRET,
      {
        expiresIn: '1h'
      }
    )

    return {
      success: true,
      token,
      data: foundUser.rows[0],
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
