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
            const foundCart = await db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2',[parseInt(cartsList[i].cartid),userid])
            if (foundCart.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Cart is unavailable'
                }
            }
            totalCartsAmount += parseInt(foundCart.rows[0].total_price)
            const tempOrderdSingleBook: OrderedBooks = {
                bookid: foundCart.rows[0].bookid,
                total_quantity: foundCart.rows[0].quantity,
                book_original_price: foundCart.rows[0].original_price,
                book_total_price: foundCart.rows[0].total_price
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
                        total_amount,
                        payment_status,
                        payment_method
                    )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING *
            `,
            [
                userid,
                phoneNumber,
                totalOrderedBooks,
                totalCartsAmount,
                'unpaid',
                'cash_on_delivery'
            ]
        )
        
        if (addOrderStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to place your order'
            }
        }

        // create stripe payment intent
        const paymentIntent = await STRIPE.paymentIntents.create({
            amount: totalCartsAmount,
            currency: 'usd',
            metadata: {
                orderid: addOrderStatus.rows[0].orderid
            }
        })

        // update order with attached orere payemnt intent id
        const updatedOrderWithPayment = await db.query('UPDATE orders SET payment_intent_id = $1 WHERE orders.userid = $2 AND orders.orderid = $3 RETURNING *',[String(paymentIntent.id),userid,parseInt(addOrderStatus.rows[0].orderid)])

        if (updatedOrderWithPayment.rowCount <= 0) {
            // delete orders after failing in payments
            await db.query('DELETE FROM orders WHERE orders.userid = $1 AND orders.orderid = $2',[userid,parseInt(addOrderStatus.rows[0].orderid)])
            return {
                success: false,
                message: 'Failed to place your orders'
            }
        }
        // clear carts and also reduce books quantity
        for (let i = 0; i < cartsList.length; i++) {
            const foundCart = await db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2',[cartsList[i].cartid,userid])

            const originalBookQuantity = await db.query('SELECT available_quantity FROM books WHERE bookid = $1',[parseInt(foundCart.rows[0].bookid)])
            const newBookQuantity: number = parseInt(originalBookQuantity.rows[0].available_quantity) - parseInt(foundCart.rows[0].quantity)

            await db.query(
                `
                    UPDATE
                        books
                    SET
                        available_quantity = $1
                    WHERE
                        bookid = $2
                    RETURNING *
                `,
                [
                    // eslint-disable-next-line no-sequences
                    newBookQuantity,
                    parseInt(foundCart.rows[0].bookid)
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
                    foundCart.rows[0].bookid
                ]
            )
        }

        return {
            success: true,
            message: 'Successfully placed your orders',
            data: {
                ...updatedOrderWithPayment.rows[0],
                client_secret: paymentIntent.client_secret
            }
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