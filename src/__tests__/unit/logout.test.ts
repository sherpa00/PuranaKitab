import { db } from '../../configs/db.configs'
import { LogOut } from '../../services/logout.service'

// mock db query module
jest.mock('../../configs/db.configs.ts', () => ({
    db: {
        query: jest.fn()
    }
}))

describe('Testing user logout service', () => {
    const userInfo = {
        userid: 1,
        username: 'test',
        email: 'test@gmail.com'
    }

    beforeEach(() => {
        // mock db query
        ;(db.query as jest.Mock).mockResolvedValue({
            rowCount: 1,
            rows: [{
                ...userInfo
            }]
        })
    })

    it('Should return success response for logging out authenticated user', async () => {
        const result = await LogOut(userInfo.userid)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully Logged out')
        expect(db.query).toHaveBeenCalled()
    })

    it('Should return error response when database query fails', async() => {
        const error = new Error('Database Error')
        ;(db.query as jest.Mock).mockRejectedValue(error)

        const result = await LogOut(userInfo.userid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to logout')
        expect(db.query).toHaveBeenCalled()
    })

    it('Should return error response when user is not found', async() => {
        ;(db.query as jest.Mock).mockResolvedValue({
            rowCount: 0,
            rows: []
        })

        const result = await LogOut(userInfo.userid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to logout')
        expect(db.query).toHaveBeenCalled()
    })

    afterAll(() => {
        jest.clearAllMocks()
    })
})