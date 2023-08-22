import { compare, hash } from 'bcrypt'
import { db } from '../../configs/db.configs'
import { DeleteUser, GetUserData, UpdateEmail, UpdatePassword, UpdateUsername } from '../../services/user.service'

jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))
jest.mock('bcrypt')

// tests for ==> get user data
describe('Testing get user data service', () => {
  const tempUserId: number = 1

  const mockedDbQuery = {
    rowCount: 1,
    rows: [
      {
        userid: tempUserId,
        username: 'test',
        email: 'test@gmail.com',
        role: 'CUSTOMER',
        createat: new Date('2020-03-02')
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValue(mockedDbQuery)
  })

  it('Should return success response for successfully getting the user data', async () => {
    const result = await GetUserData(tempUserId)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Get User Data successfull')
    expect(result.data).toBeDefined()
    expect(result.data.userid).toEqual(tempUserId)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when database queries fails while getting user data', async () => {
    ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

    const result = await GetUserData(tempUserId)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error occured while getting user data')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when user is not found while getting user data', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await GetUserData(tempUserId)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No user found')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

// tests for ==> update user username
describe('Testing update user username service', () => {
  const tempUserId: number = 1
  const tempNewUsername: string = 'new_test'

  const mockedDbQuery = {
    rowCount: 1,
    rows: [
      {
        userid: tempUserId,
        username: tempNewUsername,
        email: 'test@gmail.com'
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValue(mockedDbQuery)
  })

  it('Should return success response for successfully updating the user username', async () => {
    const result = await UpdateUsername(tempUserId, tempNewUsername)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Updated username Successfully')
    expect(result.data).toBeDefined()
    expect(result.data.userid).toEqual(tempUserId)
    expect(result.data.username).toEqual(tempNewUsername)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when database queries fails when updating user username', async () => {
    ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

    const result = await UpdateUsername(tempUserId, tempNewUsername)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while updating username')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when user is not found while updating user username', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await UpdateUsername(tempUserId, tempNewUsername)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while updating username')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

// tests for ==> update user email
describe('Testing update user email service', () => {
  const tempUserId: number = 1
  const tempNewEmail: string = 'newtest@gmail.com'

  const mockedDbQuery = {
    rowCount: 1,
    rows: [
      {
        userid: tempUserId,
        username: 'test',
        email: tempNewEmail
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValue(mockedDbQuery)
  })

  it('Should return success response for successfully updating the user email', async () => {
    const result = await UpdateEmail(tempUserId, tempNewEmail)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Updated email Successfully')
    expect(result.data).toBeDefined()
    expect(result.data.userid).toEqual(tempUserId)
    expect(result.data.email).toEqual(tempNewEmail)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when database queries fails when updating user email', async () => {
    ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

    const result = await UpdateEmail(tempUserId, tempNewEmail)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while updating email')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when user is not found while updating user email', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await UpdateEmail(tempUserId, tempNewEmail)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while updating email')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

// tests for ==> update user password
describe('Testing update user password service', () => {
  const tempUserId: number = 1
  const tempOldPassword: string = 'test_pass'
  const tempNewPassword: string = 'new_test_pass'

  const mockedGetOldPasswordDbQuery = {
    rowCount: 1,
    rows: [
      {
        password: 'old_hashed_password',
        salt: 'old_salt'
      }
    ]
  }
  const mockedUpdatePasswordDbQuery = {
    rowCount: 1,
    rows: [
      {
        userid: tempUserId,
        username: 'test',
        email: 'test@gmail.com'
      }
    ]
  }
  const mockedNewHashedPassword: string = 'new_hashed_password'

  beforeEach(() => {
    ;(compare as jest.MockedFunction<typeof compare>).mockImplementation(() => true)
    ;(hash as jest.MockedFunction<typeof hash>).mockImplementation(() => mockedNewHashedPassword)
  })

  it('Should return success response for successfully updating the user password', async () => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetOldPasswordDbQuery)
      .mockResolvedValueOnce(mockedUpdatePasswordDbQuery)

    const result = await UpdatePassword(tempUserId, tempOldPassword, tempNewPassword)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Updated Password successfully')
    expect(result.data).toBeDefined()
    expect(result.data.userid).toEqual(tempUserId)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(compare).toHaveBeenCalled()
    expect(hash).toHaveBeenCalled()
  })

  it('Should return error response when database queries fails when getting old user password for updating passoword', async () => {
    ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

    const result = await UpdatePassword(tempUserId, tempOldPassword, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while updating password')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when user is not found while updating user username', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await UpdatePassword(tempUserId, tempOldPassword, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while updating password')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when old password is incorrect', async () => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetOldPasswordDbQuery)
      .mockResolvedValueOnce(mockedUpdatePasswordDbQuery)
    ;(compare as jest.MockedFunction<typeof compare>).mockImplementation(() => false)

    const result = await UpdatePassword(tempUserId, tempOldPassword, tempNewPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Old Password incorrect')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(compare).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

// tests for ==> delete user account
describe('Testing delete user account service', () => {
  const tempUserId: number = 1
  const tempOldPassword: string = 'old_password'

  const mockedGetOldPasswordDbQuery = {
    rowCount: 1,
    rows: [
      {
        password: tempOldPassword
      }
    ]
  }
  const mockedDeltetUserDbQuery = {
    rowCount: 1,
    rows: [
      {
        userid: tempUserId,
        username: 'test',
        email: 'test@gmail.com'
      }
    ]
  }
  const mockedOldHahsedPassword: string = 'old_hashed_password'

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValue(mockedGetOldPasswordDbQuery)
    ;(db.query as jest.Mock).mockResolvedValue(mockedDeltetUserDbQuery)
    ;(compare as jest.MockedFunction<typeof compare>).mockImplementation(() => mockedOldHahsedPassword)
  })

  it('Should return success response for successfully deleting the user acount', async () => {
    const result = await DeleteUser(tempUserId, tempOldPassword)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully deleted user account')
    expect(result.data).toBeDefined()
    expect(result.data.userid).toEqual(tempUserId)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(compare).toHaveBeenCalled()
  })

  it('Should return error response when database queries fails when gettting old user passoword for deleting user account', async () => {
    ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

    const result = await DeleteUser(tempUserId, tempOldPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while deleting user')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when user is not found when deleting user acount', async () => {
    ;(db.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: []
    })

    const result = await DeleteUser(tempUserId, tempOldPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while deleting user')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
  })

  it('Should return error response when user old password is incorrect when deleting user acount', async () => {
    ;(compare as jest.MockedFunction<typeof compare>).mockImplementation(() => false)

    const result = await DeleteUser(tempUserId, tempOldPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Password is invalid')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(compare).toHaveBeenCalled()
  })

  it('Should return error response when database query fails while deleting user acount', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetOldPasswordDbQuery)
    ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

    const result = await DeleteUser(tempUserId, tempOldPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while deleting user')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should return error response when database query is empty while deleting user acount', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetOldPasswordDbQuery)
    ;(db.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 0,
      rows: []
    })

    const result = await DeleteUser(tempUserId, tempOldPassword)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Error while deleting user')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
