import { db } from '../../configs/db.configs'
import { ForgotPassword } from '../../services/forgot_password.service'
import generateResetToken, { type GenTokenStatus } from '../../helpers/generateResetToken'
import sendResetEmail, { type SendResetEmailStatus } from '../../helpers/sendResetEmail'

// mock db module
jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))

// mock generate reset token func
jest.mock('../../helpers/generateResetToken.ts')

// mock send reset email func
jest.mock('../../helpers/sendResetEmail.ts')

describe('Testing user forgot password operation', () => {
  const userInfo = {
    userid: 1,
    username: 'test',
    email: 'test@gmail.com'
  }
  const mockedResetToken: GenTokenStatus = {
    success: true,
    message: 'Successfully genrated reset token',
    token: 'mocked_reset_token'
  }
  const mockedSendEmail: SendResetEmailStatus = {
    success: true,
    message: 'Successfully sent reset email'
  }

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          ...userInfo
        }
      ]
    })
    ;(generateResetToken as jest.MockedFunction<typeof generateResetToken>).mockImplementation(() => mockedResetToken)
    ;(sendResetEmail as jest.MockedFunction<typeof sendResetEmail>).mockResolvedValue(mockedSendEmail)
  })

  it('Should return success response for successfull forgot password operaton service', async () => {
    const result = await ForgotPassword(userInfo.email)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully sent reset link via email')
    expect(db.query).toHaveBeenCalled()
    expect(generateResetToken).toHaveBeenCalled()
    expect(sendResetEmail).toHaveBeenCalled()
  })

  it('Should call both generate reset token and send email helper function for correct arguments', async () => {
    await ForgotPassword(userInfo.email)

    expect(generateResetToken).toHaveBeenCalled()
    expect(sendResetEmail).toHaveBeenCalled()
    expect(sendResetEmail).toHaveBeenCalledWith(userInfo.email, mockedResetToken.token)
  })

  it('Should return error response when database query fails', async () => {
    const error = new Error('Database Error')
    ;(db.query as jest.Mock).mockRejectedValue(error)

    const result = await ForgotPassword(userInfo.email)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed with forgot password operation')
  })

  it('Should return error response when user is not found', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await ForgotPassword(userInfo.email)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed with forgot password operation')
  })

  it('Should return error response when genrate reset token fails', async () => {
    ;(generateResetToken as jest.MockedFunction<typeof generateResetToken>).mockImplementation(() => {
      return {
        success: false,
        message: 'Error while genrating reset token'
      }
    })

    const result = await ForgotPassword(userInfo.email)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed with forgot password operation')
    expect(generateResetToken).toHaveBeenCalled()
  })

  it('Should return error response when send reset token email fails', async () => {
    ;(sendResetEmail as jest.MockedFunction<typeof sendResetEmail>).mockResolvedValue({
      success: false,
      message: 'Error while sending reset email'
    })

    const result = await ForgotPassword(userInfo.email)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed with forgot password operation')
    expect(sendResetEmail).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
