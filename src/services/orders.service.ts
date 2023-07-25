import * as dotenv from 'dotenv'
import Stripe from 'stripe'
import { db } from '../configs/db.configs'
import { type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

dotenv.config()

interface OrderedBooks {
    bookid: number,
    total_quantity: number,
    book_original_price: number,
    book_total_price: number
}

// strip init
const STRIPE_SECRET: string = String(process.env.STRIPE_SECRET)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STRIPE = new Stripe(STRIPE_SECRET,{
    apiVersion: '2022-11-15'
})

// service for place order process offline of user carts
const PlaceOrderOffline = async (cartsList: [any],userid: number,phoneNumber: number): Promise<ServiceResponse> => {
    try {
        let totalCartsAmount: number = 0
        const totalOrderedBooks: any = []
        // check if cart in cartsList exist for correct userid or not
        for (let i = 0; i < cartsList.length; i++) {
            const cartCountInUserCarts = await db.query('SELECT COUNT(*) FROM carts WHERE carts.cartid = $1 AND carts.userid = $2',[cartsList[i].cartid,userid])
            if (cartCountInUserCarts.rowCount <= 0) {
                throw new Error('Failed to place order as cart is invalid')
            }
            totalCartsAmount += Number(cartsList[i].total_price)
            const tempOrderdSingleBook: OrderedBooks = {
                bookid: cartsList[i].bookid,
                total_quantity: cartsList[i].quantity,
                book_original_price: cartsList[i].original_price,
                book_total_price: cartsList[i].total_price
            }
            totalOrderedBooks.push(tempOrderdSingleBook)
        }


        // add to db order
        const addOrderStatus = await db.query(
            `
                INSERT INTO
                    orders (
                        userid,
                        phone_number,
                        ordered_books,
                        total_amount
                    )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                ) RETURNING *
            `,
            [
                userid,
                phoneNumber,
                totalOrderedBooks,
                totalCartsAmount
            ]
        )
        
        if (addOrderStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to place your order'
            }
        }

        // clear carts and also reduce books quantity
        for (let i = 0; i < cartsList.length; i++) {
            const originalBookQuantity = await db.query('SELECT available_quantity FROM books WHERE bookid = $1',[cartsList[i].bookid])
            await db.query(
                `
                    UPDATE
                        books
                    SET
                        books.available_quantity = $1
                    WHERE
                        books.bookid = $2
                `
                [
                    // eslint-disable-next-line no-sequences
                    Number(originalBookQuantity.rows[0].available_quantity) - cartsList[i].quantity,
                    cartsList[i].bookid
                ]
            )
            // clear user carts
            await db.query(
                `
                    DELETE FROM
                        carts
                    WHERE 
                        carts.userid = $1 AND carts.bookid = $2 
                `,
                [
                    userid,
                    cartsList[i].bookid
                ]
            )
        }

        return {
            success: true,
            message: 'Successfully placed your orders',
            data: addOrderStatus.rows[0]
        }
    } catch (err) {
        logger.error(err, 'Error while placing order')
        return {
            success: false,
            message: 'Failed to place your order'
        }
    }
}

// service for showing user orders
const ShowMyOrders = async (userid: number): Promise<ServiceResponse> => {
    try {

        // check if order exits or not
        const countOrders = await db.query('SELECT COUNT(*) FROM orders WHERE orders.userid = $1',[userid])

        if (countOrders.rows[0].count < 0) {
            return {
                success: false,
                message: 'Failed to get my orders'
            }
        }

        // get user orders from db
        const showOrdersStatus = await db.query('SELECT * FROM orders WHERE orders.userid = $1',[userid])

        return {
            success: true,
            message: 'Successfully got my orders',
            data: showOrdersStatus.rows
        } 
    } catch (err) {
        logger.error(err, 'Error while getting my orders')
        return {
            success: false,
            message: 'Failed to get my orders'
        }
    }
}

export {PlaceOrderOffline,ShowMyOrders}