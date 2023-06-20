import { genSalt, hash } from 'bcrypt'
import { db } from '../configs/db.configs'
import type { ServiceResponse, Iuser } from '../types'
import logger from '../utils/logger.utils'

// types for new user --> username and password only
export type InewUser = Pick<Iuser, 'username' | 'email' | 'password'>

// user service to register new user
const RegisterNewUser = async (userInfo: InewUser): Promise<ServiceResponse> => {
  try {
    // get the password salt with rounds 10;
    const salt = await genSalt(10)

    // prepare hashed password with user given password and salt given above
    const hashedPassword = await hash(userInfo.password, salt)

    // create new user here with hashed password and salt given
    const reigisterStatus = await db.query(
      'INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [userInfo.username, hashedPassword, salt, userInfo.email, 'CUSTOMER']
    )

    if (reigisterStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to register new user'
      }
    }

    return {
      success: true,
      message: 'Successfully registered new user',
      data: reigisterStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while registering new user')
    return {
      success: false,
      message: 'Error while registering new user'
    }
  }
}

export default RegisterNewUser
