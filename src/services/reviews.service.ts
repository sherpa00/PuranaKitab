import { db } from '../configs/db.configs'
import type { ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service for gettting all reviews for book
const GetAllReviews = async (bookID: number): Promise<ServiceResponse> => {
  try {
    // show if book exits or not
    const foundBook = await db.query('SELECT * FROM books WHERE books.bookid = $1', [bookID])

    if (foundBook.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book Found'
      }
    }

    // get all book review
    const foundBookReview = await db.query('SELECT * FROM reviews WHERE reviews.bookid = $1', [bookID])

    if (foundBookReview.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get all book reviews'
      }
    }

    if (foundBookReview.rowCount === 0) {
      return {
        success: true,
        message: 'Successfully got all book reviews',
        data: []
      }
    }

    return {
      success: true,
      message: 'Successfully got all book reviews',
      data: foundBookReview.rows
    }
  } catch (err) {
    logger.error(err, 'Error while getting all book reviews')
    return {
      success: false,
      message: 'Error while gettting all book reviews'
    }
  }
}

// service for adding reviews for book
const AddReview = async (
  userID: number,
  bookID: number,
  userName: string,
  reviewStars: number,
  reviewMessage: string
): Promise<ServiceResponse> => {
  try {
    // verify if book exits or not
    const foundBook = await db.query('SELECT * FROM books WHERE bookid = $1', [bookID])
    if (foundBook.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book Found'
      }
    }

    // verify if already reviews exits for same user and book
    const reviewsFound = await db.query('SELECT * FROM reviews WHERE userid = $1 AND bookid = $2', [userID, bookID])

    if (reviewsFound.rowCount > 0) {
      return {
        success: false,
        message: 'Already reviewed book'
      }
    }

    // add reviews
    const bookReviewAddStatus = await db.query(
      'INSERT INTO reviews(userid, bookid, username, stars, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userID, bookID, userName, reviewStars, reviewMessage]
    )

    if (bookReviewAddStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to add book review'
      }
    }

    return {
      success: true,
      message: 'Successfully added book review',
      data: bookReviewAddStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while adding book review')
    return {
      success: false,
      message: 'Error while adding book review'
    }
  }
}

// servie for removing single book reivew
const RemoveSinlgeReview = async (reviewID: number): Promise<ServiceResponse> => {
  try {
    // check if book reviews exits or not
    const foundReview = await db.query('SELECT * FROM reviews WHERE reviews.reviewid = $1', [reviewID])

    if (foundReview.rowCount <= 0) {
      return {
        success: false,
        message: 'No book reviews found'
      }
    }

    // remove book reivew
    const removeBookReviewStatus = await db.query('DELETE FROM reviews WHERE reviews.reviewid = $1 RETURNING *', [
      reviewID
    ])

    if (removeBookReviewStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove book review'
      }
    }

    return {
      success: true,
      message: 'Successfully removed book review',
      data: removeBookReviewStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while removing a book review')
    return {
      success: false,
      message: 'Error while removing a book reivew'
    }
  }
}

// service for removing all book reviews for book
const RemoveAllReviews = async (bookID: number): Promise<ServiceResponse> => {
  try {
    // verify if book exits or not
    const bookFound = await db.query('SELECT * FROM books WHERE books.bookid = $1', [bookID])

    if (bookFound.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book Found'
      }
    }

    // revove book reviews
    const removeBookReviewsStatus = await db.query('DELETE FROM reviews WHERE bookid = $1 RETURNING *', [bookID])

    if (removeBookReviewsStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove all book reviews'
      }
    }

    return {
      success: true,
      message: 'Successfully removed all book reviews',
      data: removeBookReviewsStatus.rows
    }
  } catch (err) {
    logger.error(err, 'Error while removing all book reviews')
    return {
      success: false,
      message: 'Error while removing all book reviews'
    }
  }
}

export { AddReview, GetAllReviews, RemoveSinlgeReview, RemoveAllReviews }
