import * as dotenv form 'dotenv'
import Stripe from 'stripe'
import { db } from '../../configs/db.configs'
import { RemoveOrder, ShowMyOrders } from '../../services/orders.service'

jest.mock('../../configs/db.configs.ts', () => ({
    db: {
        query: jest.fn()
    }
}))


describe('Testing show my orders service', () => {
    const userid: number = 1

    const mockedCountOrdersDbQuery = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }

    const mockedGetOrdersDbQuery = {
        rwoCount: 1,
        rows: [{
            'orderid': 123,
      'userid': 1,
      'phone_number': 9807462732,
      'ordered_books': [
        {
          'bookid': 234,
          'total_quantity': 1,
          'book_original_price': 1000,
          'book_total_price': 1000
        }
      ],
      'total_amount': 1000,
      'payment_intent_id': 'jfdj_fj3298foj20384',
      'payment_status': 'paid',
      'payment_method': 'card'
        }]
    }

    it('Should return success response when gettting my orders', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountOrdersDbQuery)
            .mockResolvedValueOnce(mockedGetOrdersDbQuery)
        
        const result = await ShowMyOrders(userid)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got my orders')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedGetOrdersDbQuery.rows)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while counting orders for gettting my orders', async() => {
        jest.restoreAllMocks()
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedGetOrdersDbQuery)
        
        const result = await ShowMyOrders(userid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get my orders')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while gettting my orders', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountOrdersDbQuery)
            .mockRejectedValueOnce(new Error('Database Error'))
        
        const result = await ShowMyOrders(userid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get my orders')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing remove my orders service', () => {
    const orderid: number = 1

    const mockedGetOrdersDbQuery = {
        rowCount: 1,
        rows: [{
            payment_status: 'paid'
        }]
    }

    const mockedRemoveOrdersDbQuery = {
        rwoCount: 1,
        rows: [{
            'orderid': 123,
      'userid': 1,
      'phone_number': 9807462732,
      'ordered_books': [
        {
          'bookid': 234,
          'total_quantity': 1,
          'book_original_price': 1000,
          'book_total_price': 1000
        }
      ],
      'total_amount': 1000,
      'payment_intent_id': 'jfdj_fj3298foj20384',
      'payment_status': 'paid',
      'payment_method': 'card'
        }]
    }

    it('Should return success response when removing my orders', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetOrdersDbQuery)
            .mockResolvedValueOnce(mockedRemoveOrdersDbQuery)
        
        const result = await RemoveOrder(orderid)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully removed order')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedRemoveOrdersDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while getting orders for removing my orders', async() => {
        jest.restoreAllMocks()
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database Error'))
            .mockResolvedValueOnce(mockedRemoveOrdersDbQuery)
        
        const result = await RemoveOrder(orderid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove order')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when order not found for removing my orders', async() => {
        jest.restoreAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 0,
                rows: []
            })
            .mockResolvedValueOnce(mockedRemoveOrdersDbQuery)
        
        const result = await RemoveOrder(orderid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('No Order Found')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when payment is due for removing my orders', async() => {
        jest.restoreAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{
                    payment_status: 'unpaid'
                }]
            })
            .mockResolvedValueOnce(mockedRemoveOrdersDbQuery)
        
        const result = await RemoveOrder(orderid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Order payment is due')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while removing my order', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetOrdersDbQuery)
            .mockRejectedValueOnce(new Error('Database Error'))
        
        const result = await RemoveOrder(orderid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove order')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

/*
describe('Testing place order offline service', () => {
    const cartsList: {cartid: number}[] = [{
        cartid: 1
    }]
    const userid: number = 1
    const phoneNumber: number = 98048883209

    const mockedGetCartsDbQuery = {
        rowCount: 1,
        rows: [{
            'cartid': 1,
      'userid': 1,
      'bookid': 1,
      'quantity': 1,
      'original_price': 1000,
      'total_price': 1000
        }]
    }

    const mockedAddOrderDbQuery = {
        rowCount: 1,
        rows: [{
            'orderid': 1,
      'userid': 1,
      'phone_number': phoneNumber,
      'ordered_books': [
        {
          'bookid': 1,
          'total_quantity': 1,
          'book_original_price': 1000,
          'book_total_price': 1000
        }
      ],
      'total_amount': 1000,
      'payment_intent_id': 'jfdj_fj3298foj20384',
      'payment_status': 'unpaid',
      'payment_method': 'card'
        }]
    }

    it('Should return success response when placing order offline', async() => {
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedGetCartsDbQuery)
            .mockResolvedValueOnce(mockedAddOrderDbQuery)
        
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
*/