import { db } from '../configs/db.configs'

interface UserDataInfo {
  success: boolean
  message: string
  data?: any
}

// service for get  user's data
const GetUserData = async (authenticatedUserid: number): Promise<UserDataInfo> => {
  try {
    // get the user data from db
    const userData = await db.query(`SELECT username,userid,email,createat FROM users WHERE users.userid = $1`, [
      authenticatedUserid
    ])

    if (userData.rowCount <= 0) {
      return {
        success: false,
        message: 'No user found'
      }
    }

    return {
      success: true,
      message: 'Get User Data successful',
      data: userData.rows[0]
    }
  } catch (err) {
    console.log(err)
    console.log('Error while getting user data')
    return {
      success: false,
      message: 'Error occured while getting user data'
    }
  }
}

export { type UserDataInfo, GetUserData }
