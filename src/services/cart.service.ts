import { db } from "../configs/db.configs"

// response type for cart service
export interface  CartInfoResponse {
    success: boolean
    message: string
    data?: any
}


// service to add new cart for user
const AddCart = async (userID: number, bookID: number, bookQuantity: number): Promise<CartInfoResponse> => {
    try {
        // get the book from db by bookid
        const foundBookWithBookid = await db.query(`SELECT * FROM books WHERE bookid = $1`, [bookID])

        if (foundBookWithBookid.rowCount <= 0) {
            return {
                success: false,
                message: 'No Book Found with bookid: ' + String(bookID)
            }
        }

        // retreive price and available quantity of book
        const originalBookPrice: number = foundBookWithBookid.rows[0].price
        const originalBookAvailableQuantity: number = foundBookWithBookid.rows[0].available_quantity

        // verify book quantity is available
        const isBookAvailable: boolean = originalBookAvailableQuantity >= bookQuantity

        if (!isBookAvailable) {
            return {
                success: false,
                message: 'Book is not in available quantity'
            }
        }

        // compute total price of book with quantiy
        const totalBookPrice: number = originalBookAvailableQuantity * originalBookPrice

        // add new cart to db
        const addNewCartStatus = await db.query(`INSERT INTO carts (userid, bookid, quantity, original_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *`,[
            userID,
            bookID,
            bookQuantity,
            originalBookPrice,
            totalBookPrice
        ])

        if (addNewCartStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to add new cart'
            }
        }

        return {
            success: true,
            message: 'Succesfully added cart with cartid: ' + String(addNewCartStatus.rows[0].cartid),
            data: addNewCartStatus.rows[0]
        }
        
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: 'Error while adding new cart'
        }
    }
}

export {AddCart}