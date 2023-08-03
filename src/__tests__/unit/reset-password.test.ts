import { hash } from 'bcrypt'
import { db } from '../../configs/db.configs'
import { ResetPassword } from '../../services/reset-password.service'

jest.mock('bcrypt')
jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))

describe('Testing user reset password service', () => {
  const tempEmail: string = 'test@gmail.com'
  const tempToken: string = 'temp_reset_token'
  const tempNewPassword: string = 'temp_password'
  const tempSalt: string = 'temp_salt'

  const mockedHashPassword: string = 'mocked_hashed_password'

  const mockedDbResetTokens = {
    rowCount: 1,
    rows: [
      {
        email: tempEmail
      }
    ]
  }
  const mockedDbUsers = {
    rowCount: 1,
    rows: [
      {
        userid: 1,
        username: 'test',
        salt: tempSalt,
        email: tempEmail
      }
    ]
  }

  const mockedDbUpdateUsers = {
    rowCount: 1,
    rows: [
      {
        userid: 1,
        username: 'test',
        email: tempEmail
      }
    ]
  }

  beforeEach(() => {
    ;(hash as jest.MockedFunction<typeof hash>).mockImplementation(() => mockedHashPassword)
  })

  it('Should return success response when sucessfully reseting password', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUpdateUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)

    const result = await ResetPassword(tempToken, tempNewPassword)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully reset password')
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(4)
  })

  it('Should call hash function with correct arguments', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUpdateUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)

    await ResetPassword(tempToken, tempNewPassword)

    expect(hash).toHaveBeenCalled()
    expect(hash).toHaveBeenCalledTimes(1)
    expect(hash).toHaveBeenCalledWith(tempNewPassword, tempSalt)
  })

  it('Should return error response when reset token is empty', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] })

    const result = await ResetPassword(tempToken, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Reset Token Invalid or Expired')
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when user is empty', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)
    ;(db.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 0,
      rows: []
    })

    const result = await ResetPassword(tempToken, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No User Account Found')
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should return error response when unsuccessfull update of user passoword', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] })

    const result = await ResetPassword(tempToken, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to reset password')
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(3)
  })

  it('Should return error response when unsuccessfull delete of reset token', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbResetTokens)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbUpdateUsers)
    ;(db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] })

    const result = await ResetPassword(tempToken, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to reset password')
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(4)
  })

  it('Should return error response when database querirs fails', async () => {
    const error = new Error('Database Error')
    ;(db.query as jest.Mock).mockRejectedValue(error)

    const result = await ResetPassword(tempToken, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to reset password')
    expect(db.query).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
