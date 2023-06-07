
import { db } from '../configs/db.configs'

// review response type
export interface ReviewInfoResponse {
  success: boolean
  message: string
  data?: any
}

// service for gettting all reviews for book
const GetAllReviews = async (bookID: number): Promise<ReviewInfoResponse> => {
    try {
        // show if book exits or not
        const foundBook = await db.query(`SELECT * FROM books WHERE books.bookid = $1`,[bookID])

        if (foundBook.rowCount <= 0) {
            return {
                success: false,
                message: 'No Book Found'
            }
        }

        // get all book review
        const foundBookReview = await db.query(`SELECT * FROM reviews WHERE reviews.bookid = $1`,[bookID])

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
        console.log(err)
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
): Promise<ReviewInfoResponse> => {
  try {
    // verify if book exits or not
    const foundBook = await db.query(`SELECT * FROM books WHERE bookid = $1`, [bookID])
    if (foundBook.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book Found'
      }
    }

    // verify if already reviews exits for same user and book
    const reviewsFound = await db.query(`SELECT * FROM reviews WHERE userid = $1 AND bookid = $2`, [userID, bookID])

    if (reviewsFound.rowCount > 0) {
      return {
        success: false,
        message: 'Already reviewed book'
      }
    }

    // add reviews
    const bookReviewAddStatus = await db.query(
      `INSERT INTO reviews(userid, bookid, username, stars, message) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
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
    console.log(err)
    return {
      success: false,
      message: 'Error while adding book review'
    }
  }
}

export { AddReview, GetAllReviews }
