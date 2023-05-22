import { genSalt, hash } from 'bcrypt'
import { db } from '../configs/db.configs'
import { type Iuser } from '../types'

// types for new user --> username and password only
export type InewUser = Pick<Iuser, 'username' | 'email' | 'password'>

// user service to register new user
const RegisterNewUser = async (userInfo: InewUser): Promise<void> => {
  try {
    // get the password salt with rounds 10;
    const salt = await genSalt(10)

    // prepare hashed password with user given password and salt given above
    const hashedPassword = await hash(userInfo.password, salt)

    // create new user here with hashed password and salt given
    await db.query('INSERT INTO users (username,password,salt,email) VALUES ($1,$2,$3,$4) RETURNING *', [
      userInfo.username,
      hashedPassword,
      salt,
      userInfo.email
    ])
  } catch (err) {
    console.log(err)
  }
}

export default RegisterNewUser
