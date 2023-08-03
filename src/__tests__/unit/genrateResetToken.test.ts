import { v4 as uuidv4 } from 'uuid'
import generateResetToken from '../../helpers/generateResetToken'

// mock uuid module
jest.mock('uuid')

describe('Testing genrate reset token helper function', () => {
  const mockedToken: string = 'mocked_uuid_token'

  beforeEach(() => {
    ;(uuidv4 as jest.MockedFunction<typeof uuidv4>).mockImplementation(() => mockedToken)
  })

  it('Should return success response when successfully genrating reset token', () => {
    const result = generateResetToken()

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully generated reset token')
    expect(result.token).toBeDefined()
    expect(result.token).toEqual(mockedToken)
  })

  it('Should call uuidv4 function with correct arguments', () => {
    generateResetToken()

    expect(uuidv4).toHaveBeenCalled()
    expect(uuidv4).toHaveBeenCalledWith()
  })

  it('Should return error response when uuid token genration fails', () => {
    ;(uuidv4 as jest.MockedFunction<typeof uuidv4>).mockImplementation(() => {
      throw new Error('UUID generation error')
    })

    const result = generateResetToken()

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while genrating reset token')
    expect(result.token).toBeUndefined()
    expect(uuidv4).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
