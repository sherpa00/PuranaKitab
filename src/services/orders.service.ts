import { db } from '../configs/db.configs'
import { type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

interface OrderedBooks {
    bookid: number,
    total_quantity: number,
    book_original_price: number,
    book_total_price: number
}

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
            await db.query(
                `
                    UPDATE
                        books
                    SET
                        books.available_quantity = books.available_quantity - $1
                    WHERE
                        books.bookid = $2
                `
                [
                    // eslint-disable-next-line no-sequences
                    cartsList[i].quantity,
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

export {PlaceOrderOffline}