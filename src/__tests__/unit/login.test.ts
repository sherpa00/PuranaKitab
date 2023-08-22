import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { db } from '../../configs/db.configs'
import * as dotenv from 'dotenv'
import LoginUser from '../../services/login.service'
import { type InewUser } from '../../services/register.service'

// logger mock module
jest.mock('../../utils/logger.utils.ts', () => ({
  error: jest.fn()
}))

// dotenv config mock moudle
jest.mock('dotenv')

// db mock module
jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))

// bcrypt compare mock module
jest.mock('bcrypt')

// jwt sign mock module
jest.mock('jsonwebtoken')

describe('Testing Login user service', () => {
  const userInfo: Pick<InewUser, 'email' | 'password'> = {
    email: 'test@gmail.com',
    password: 'testing'
  }
  const mockedJWT: string = 'mocked_jwt_token'

  beforeEach(() => {
    ;(dotenv.config as jest.MockedFunction<typeof dotenv.config>).mockReturnValue({})
    // get resolved value for db.query
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          userid: 1,
          username: 'test',
          email: userInfo.email
        }
      ]
    })
    ;(compare as jest.MockedFunction<typeof compare>).mockImplementation(() => true)
    ;(sign as jest.MockedFunction<typeof sign>).mockImplementation(() => mockedJWT)
  })

  it('Should return success response for successfull login of user', async () => {
    const result = await LoginUser(userInfo)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully Loggedin')
    expect(result.data).toBeDefined()
    expect(result.token).toBeDefined()
    expect(result.token).toEqual(mockedJWT)
    expect(db.query).toHaveBeenCalled()
  })

  it('Should call compare and sign function with correct aruguments', async () => {
    await LoginUser(userInfo)

    expect(compare).toHaveBeenCalled()
    expect(sign).toHaveBeenCalled()
  })

  it('should return an error response if database query fails', async () => {
    const error = new Error('Database Error')
    ;(db.query as jest.Mock).mockRejectedValue(error)

    const result = await LoginUser(userInfo)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('User Email or Password incorrect')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('should return an error response if user is not found', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await LoginUser(userInfo)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('User Email or Password incorrect')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('should return an error response if password is incorrect', async () => {
    ;(compare as jest.MockedFunction<typeof compare>).mockImplementation(() => false)

    const result = await LoginUser(userInfo)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('User Email or Password incorrect')
    expect(result.data).toBeUndefined()
    expect(compare).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
