import { db } from '../configs/db.configs'
import type { ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service to get all cart for user
const GetAllCart = async (userID: number): Promise<ServiceResponse> => {
  try {
    // get cart from userid
    const getCartStatus = await db.query('SELECT * FROM carts WHERE carts.userid = $1', [userID])

    if (getCartStatus.rowCount < 0) {
      return {
        success: true,
        message: 'Failed to get all carts'
      }
    }

    return {
      success: true,
      message: 'Successfully got all carts',
      data: getCartStatus.rows
    }
  } catch (err) {
    logger.error(err, 'Error while gettting all carts')
    return {
      success: false,
      message: 'Failed to get all carts'
    }
  }
}

// service to add new cart for user
const AddCart = async (userID: number, bookID: number, bookQuantity: number): Promise<ServiceResponse> => {
  try {
    // get the book from db by bookid
    const foundBookWithBookid = await db.query('SELECT price, available_quantity FROM books WHERE bookid = $1', [
      bookID
    ])

    if (foundBookWithBookid.rowCount <= 0) {
      return {
        success: false,
        message: 'Book is not available'
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
    const totalBookPrice: number = bookQuantity * originalBookPrice

    // add new cart to db
    const addNewCartStatus = await db.query(
      'INSERT INTO carts (userid, bookid, quantity, original_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userID, bookID, bookQuantity, originalBookPrice, totalBookPrice]
    )

    if (addNewCartStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to add cart'
      }
    }

    return {
      success: true,
      message: 'Successfully added cart',
      data: addNewCartStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while adding new cart')
    return {
      success: false,
      message: 'Failed to add cart'
    }
  }
}

// service for updating cart
const UpdateCart = async (userID: number, cartID: number, bookQuantity: number): Promise<ServiceResponse> => {
  try {
    // first verify if cart exits or not with cartID
    const foundCart = await db.query(
      'SELECT bookid, original_price FROM carts WHERE carts.cartid = $1 AND carts.userid = $2',
      [cartID, userID]
    )

    if (foundCart.rowCount <= 0) {
      return {
        success: false,
        message: 'No Cart Found'
      }
    }

    const bookFound = await db.query('SELECT available_quantity FROM books WHERE bookid = $1', [
      foundCart.rows[0].bookid
    ])

    if (bookFound.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book found for cart'
      }
    }

    const originalBookAvailableQuantity: number = parseInt(bookFound.rows[0].available_quantity)

    // verify book quantity is available
    const isBookAvailable: boolean = originalBookAvailableQuantity >= bookQuantity

    if (!isBookAvailable) {
      return {
        success: false,
        message: 'Book is not in available quantity'
      }
    }

    // new total price with updated quantity
    const newTotalPrice: number = parseInt(foundCart.rows[0].original_price) * bookQuantity

    // update cart
    const updateCartStatus = await db.query('UPDATE carts SET quantity = $1, total_price = $2 RETURNING *', [
      bookQuantity,
      newTotalPrice
    ])

    if (updateCartStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to update cart'
      }
    }

    return {
      success: true,
      message: 'Successfully updated cart',
      data: updateCartStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating a cart')
    return {
      success: false,
      message: 'Failed to update cart'
    }
  }
}

// service for removing single cart
const RemoveSingleCart = async (userID: number, cartID: number): Promise<ServiceResponse> => {
  try {
    // verify if cart exists or not
    const foundCart = await db.query('SELECT cartid FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
      cartID,
      userID
    ])

    if (foundCart.rowCount <= 0) {
      return {
        success: false,
        message: 'No Cart Found'
      }
    }

    // remove cart
    const removeSingleCartStatus = await db.query(
      'DELETE FROM carts WHERE carts.cartid = $1 AND carts.userid = $2 RETURNING *',
      [cartID, userID]
    )

    if (removeSingleCartStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove cart'
      }
    }

    return {
      success: true,
      message: 'Successfully removed cart',
      data: removeSingleCartStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while removing a single cart')
    return {
      success: false,
      message: 'Failed to remove cart'
    }
  }
}

// service for removing single cart
const RemoveAllCart = async (userID: number): Promise<ServiceResponse> => {
  try {
    // verify if cart exists or not
    const foundCart = await db.query('SELECT cartid FROM carts WHERE carts.userid = $1', [userID])

    if (foundCart.rowCount <= 0) {
      return {
        success: false,
        message: 'No Carts Found'
      }
    }

    // remove cart
    const removeAllCartStatus = await db.query('DELETE FROM carts WHERE carts.userid = $1 RETURNING *', [userID])

    if (removeAllCartStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove all carts'
      }
    }

    return {
      success: true,
      message: 'Successfully removed all carts',
      data: removeAllCartStatus.rows
    }
  } catch (err) {
    logger.error(err, 'Error while removing all carts')
    return {
      success: false,
      message: 'Failed to remove all carts'
    }
  }
}

export { GetAllCart, AddCart, UpdateCart, RemoveSingleCart, RemoveAllCart }
