import { db } from '../../configs/db.configs'
import { AddCart, GetAllCart, RemoveAllCart, RemoveSingleCart, UpdateCart } from '../../services/cart.service'

jest.mock('../../configs/db.configs.ts', () => ({
    db: {
        query: jest.fn()
    }
}))

describe('Testing get user carts', () => {
    const userID: number = 1

    const mockedGetCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': 1,
            'userid': 1,
            'bookid': 1,
            'quantity': 1,
            'original_price': 100,
            'total_price': 100
        }]
    }

    beforeEach(() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock).mockResolvedValue(mockedGetCartsDbQuery)
    })

    it('Should return success response when getting user carts', async() => {
        const result = await GetAllCart(userID)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got all carts')
        expect(result.data).toBeDefined()
        expect(result.data[0]).toEqual(mockedGetCartsDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
    })

    it('Should return error response when database fails while getting user carts', async() => {
        ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

        const result = await GetAllCart(userID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all carts')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing add user carts', () => {
    const userID: number = 1
    const bookID: number = 1
    const bookQuantity: number = 1

    const mockedGetBookDbQuery = {
        rowCount: 1,
        rows: [{
            price: 100,
            available_quantity: 1
        }]
    }

    const mockedAddCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': 1,
            'userid': userID,
            'bookid': bookID,
            'quantity': bookQuantity,
            'original_price': mockedGetBookDbQuery.rows[0].price,
            'total_price': mockedGetBookDbQuery.rows[0].price * bookQuantity
        }]
    }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('Should return success response when adding user carts', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockResolvedValueOnce(mockedAddCartsDbQuery)

        const result = await AddCart(userID,bookID,bookQuantity)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully added cart')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedAddCartsDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while getting books while adding user cart', async() => {
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedAddCartsDbQuery)

        const result = await AddCart(userID, bookID, bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to add cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when book is unavailable while getting books while adding user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 0,
                rows: []
            })
            .mockResolvedValueOnce(mockedAddCartsDbQuery)

        const result = await AddCart(userID, bookID, bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is not available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while adding user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockRejectedValue(new Error('Database Error'))
        

        const result = await AddCart(userID, bookID, bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to add cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when book is insufficient while adding user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockResolvedValueOnce(mockedAddCartsDbQuery)
        
        const newBookQuantity: number = 20

        const result = await AddCart(userID, bookID, newBookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is not in available quantity')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing update user carts', () => {
    const userID: number = 1
    const cartID: number = 1
    const bookQuantity: number = 3

    const mockedGetCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'bookid': 1,
            'original_price': 100
        }]
    }
    const mockedGetBookDbQuery = {
        rowCount: 1,
        rows: [{
            available_quantity: 5
        }]
    }
    const mockedUpdateCartDbQuery = {
        rowCount: 1,
        rows: [{
                'cartid': cartID,
                'userid': userID,
                'bookid': 1,
                'quantity': bookQuantity,
                'original_price': mockedGetCartsDbQuery.rows[0].original_price,
                'total_price': mockedGetCartsDbQuery.rows[0].original_price * bookQuantity
        }]
    }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('Should return success response when updating user carts', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockResolvedValueOnce(mockedUpdateCartDbQuery)

        const result = await UpdateCart(userID,cartID,bookQuantity)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully updated cart')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedUpdateCartDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveReturnedTimes(3)
    })

    it('Should return error response when database fails while getting carts for updating user carts', async() => {
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockResolvedValueOnce(mockedUpdateCartDbQuery)

        const result = await UpdateCart(userID,cartID,bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveReturnedTimes(1)
    })

    it('Should return error response when cart is not found for updating user carts', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 0,
                rows: []
            })
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockResolvedValueOnce(mockedUpdateCartDbQuery)

        const result = await UpdateCart(userID,cartID,bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('No Cart Found')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveReturnedTimes(1)
    })

    it('Should return error response when database fails while getting books for updating user carts', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedUpdateCartDbQuery)

        const result = await UpdateCart(userID,cartID,bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveReturnedTimes(2)
    })

    it('Should return error response when book quantity is not available for updating user carts', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockResolvedValueOnce(mockedUpdateCartDbQuery)

        const newBookQuantity: number = mockedGetBookDbQuery.rows[0].available_quantity + 10
        
        const result = await UpdateCart(userID,cartID, newBookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is not in available quantity')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveReturnedTimes(2)
    })

    it('Should return error response when database fails while updating user carts', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockResolvedValueOnce(mockedGetBookDbQuery)
            .mockRejectedValueOnce(new Error('Database Error'))

        const result = await UpdateCart(userID,cartID,bookQuantity)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveReturnedTimes(3)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing remove single user carts', () => {
    const userID: number = 1
    const cartID: number = 1

    const mockedGetCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': cartID
        }]
    }
    const mockedRemoveCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': cartID,
            'userid': 1,
            'bookid': 1,
            'quantity': 1,
            'original_price': 100,
            'total_price': 100
        }]
    }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('Should return success response when removing single user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockResolvedValueOnce(mockedRemoveCartsDbQuery)

        const result = await RemoveSingleCart(userID, cartID)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully removed cart')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedRemoveCartsDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while getting carts for removing single user cart', async() => {
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedRemoveCartsDbQuery)

        const result = await RemoveSingleCart(userID, cartID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when cart is not found for removing single user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 0,
                rows: []
            })
            .mockResolvedValueOnce(mockedRemoveCartsDbQuery)

        const result = await RemoveSingleCart(userID, cartID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('No Cart Found')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while removing single user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockRejectedValueOnce(new Error('Database Error'))

        const result = await RemoveSingleCart(userID, cartID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove cart')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing remove all user carts', () => {
    const userID: number = 1

    const mockedGetCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': 1
        }]
    }
    const mockedRemoveCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': 1,
            'userid': 1,
            'bookid': 1,
            'quantity': 1,
            'original_price': 100,
            'total_price': 100
        }]
    }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('Should return success response when removing all user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockResolvedValueOnce(mockedRemoveCartsDbQuery)

        const result = await RemoveAllCart(userID)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully removed all carts')
        expect(result.data).toBeDefined()
        expect(result.data[0]).toEqual(mockedRemoveCartsDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })
    
    it('Should return error response when database fails while getting carts for removing all user cart', async() => {
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedRemoveCartsDbQuery)

        const result = await RemoveAllCart(userID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove all carts')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when carts is not found for removing all user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 0,
                rows: []
            })
            .mockResolvedValueOnce(mockedRemoveCartsDbQuery)

        const result = await RemoveAllCart(userID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('No Carts Found')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while removing all user cart', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockRejectedValueOnce(new Error('Database Error'))

        const result = await RemoveAllCart(userID)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove all carts')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
