import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'
import type { userPayload } from '../configs/passport.config'
import { AddReview, GetAllReviews, RemoveAllReviews, type ReviewInfoResponse } from '../services/reviews.service'
import { StatusCodes } from 'http-status-codes'

const GetAllOneBookReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validationn error
    const reviewInputErrors = validationResult(req)
    if (!reviewInputErrors.isEmpty()) {
      const error = new CustomError('Validation Errors', 403)
      throw error
    }
    // req body
    const bookID: number = parseInt(req.body.bookid)

    // call get all book reviews service
    const gotAllBookReviews: ReviewInfoResponse = await GetAllReviews(bookID)

    if (!gotAllBookReviews.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...gotAllBookReviews
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...gotAllBookReviews
    })
  } catch (err) {
    next(err)
  }
}

// controller to add book review
const AddOneReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation errors
    const reviewInputErrors = validationResult(req)
    if (!reviewInputErrors.isEmpty()) {
      const error = new CustomError('Validation Errors', 403)
      throw error
    }

    // get authenticated user and userid
    const authenticatedUserData: userPayload = req.user as userPayload
    const authenticatedUserId: number = authenticatedUserData.userid
    const authenticatedUserName: string = authenticatedUserData.username

    // req body
    const bookID: number = parseInt(req.body.bookid)
    const reviewStars: number = parseInt(req.body.stars)
    const reviewMessage: string = String(req.body.message)

    // call add book review
    const addBookReviewStatus: ReviewInfoResponse = await AddReview(
      authenticatedUserId,
      bookID,
      authenticatedUserName,
      reviewStars,
      reviewMessage
    )

    if (!addBookReviewStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...addBookReviewStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...addBookReviewStatus
    })
  } catch (err) {
    next(err)
  }
}

// controllers for removing all book reviews
const RemoveAllOneBookReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
         // validation errors
        const reviewInputErrors = validationResult(req)
        if (!reviewInputErrors.isEmpty()) {
            const error = new CustomError('Validation Errors', 403)
            throw error
        }

        // req body
        const bookID: number = parseInt(req.body.bookid)
        
        // call remove all book reviews service
        const removeBookReviewsStatus: ReviewInfoResponse = await RemoveAllReviews(bookID)

        if (!removeBookReviewsStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...removeBookReviewsStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...removeBookReviewsStatus
        })
    } catch (err) {
        next(err)
    }
}

export { AddOneReview, GetAllOneBookReview, RemoveAllOneBookReviews }
