import nodemailer, { type Transporter } from 'nodemailer'
import * as dotenv from 'dotenv'
import sendResetEmail from '../../helpers/sendResetEmail'

jest.mock('dotenv')
jest.mock('nodemailer')

describe('Testing send reset email helper function', () => {
  const tempEmail: string = 'test@gmail.com'
  const tempToken: string = 'temp_token'
  const mockedTransporter: Transporter = {
    sendMail: jest.fn().mockResolvedValue(undefined)
  } as unknown as Transporter
  beforeEach(() => {
    ;(dotenv.config as jest.MockedFunction<typeof dotenv.config>).mockReturnValue({})
    ;(nodemailer.createTransport as jest.MockedFunction<typeof nodemailer.createTransport>).mockReturnValue(
      mockedTransporter
    )
  })

  it('Should return success response when successfully sending reset email', async () => {
    const result = await sendResetEmail(tempEmail, tempToken)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully sent reset email')
    expect(nodemailer.createTransport).toHaveBeenCalled()
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalled()
  })

  it('Should return error response when nodemailer tranporter fails', async () => {
    const mockedTransporter: Transporter = {
      sendMail: jest.fn().mockRejectedValue(new Error('Sending email failed')) // The sendMail function returns a rejected Promise when there's an error
    } as unknown as Transporter
    ;(nodemailer.createTransport as jest.MockedFunction<typeof nodemailer.createTransport>).mockReturnValue(
      mockedTransporter
    )

    const result = await sendResetEmail(tempEmail, tempToken)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while sending reset email')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
