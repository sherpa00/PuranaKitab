import { genSalt, hash } from 'bcrypt'
import { db } from '../../configs/db.configs'
import RegisterNewUser, { type InewUser } from '../../services/register.service'

jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn()
}))

describe('Testing Register New User Service', () => {
  const mockSalt: string = 'mocked_salt'
  const mockHashedPassword: string = 'mocked_hashed_password'

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          userid: 1,
          username: 'testuser',
          email: 'test@gmail.com'
        }
      ]
    })
    ;(genSalt as jest.Mock).mockResolvedValue(mockSalt)
    ;(hash as jest.Mock).mockResolvedValue(mockHashedPassword)
  })
  // user info
  const userInfo: InewUser = {
    username: 'testuser',
    email: 'test@gmail.com',
    password: 'testpassword'
  }

  it('should return success response for successfully registration of new user', async () => {
    const result = await RegisterNewUser(userInfo)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully registered new user')
    expect(result.data).toBeDefined()
    expect(db.query).toHaveBeenCalled()
    expect(result.data.username).toEqual(userInfo.username)
  })

  it('should call genSalt and hash functions with correct arguments', async () => {
    await RegisterNewUser(userInfo)

    expect(db.query).toHaveBeenCalled() // db query is called
    expect(genSalt).toHaveBeenCalled()
    expect(genSalt).toHaveBeenCalledWith(10) // salt rounds 10
    expect(hash).toHaveBeenCalled()
    expect(hash).toHaveBeenCalledWith(userInfo.password, mockSalt) // user password and mocked salt
  })

  it('should return an error response if database query fails', async () => {
    const error = new Error('Database Error')
    ;(db.query as jest.Mock).mockRejectedValue(error)

    const result = await RegisterNewUser(userInfo)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to register new user')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('should return an error response if database query result is empty', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await RegisterNewUser(userInfo)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to register new user')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
