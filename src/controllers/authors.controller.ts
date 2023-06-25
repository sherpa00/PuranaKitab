import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'
import { type ServiceResponse } from '../types'
import { GetAllBookAuthors } from '../services/authors.service'
import { StatusCodes } from 'http-status-codes'

// controller for getting all book authors
const GetAllBookOneAuthors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // valiation error
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    let getAllBooksAuthorsStatus: ServiceResponse
    // call get all book authors
    if (
      (req.query.page === null || req.query.page === undefined) &&
      (req.query.size === null || req.query.size === undefined)
    ) {
      // pagination is not provied
      // call get all books authors without pagination
      getAllBooksAuthorsStatus = await GetAllBookAuthors()
    } else {
      // pagination provided either page or limt or both
      const page: number = req.query.page !== null && req.query.page !== undefined ? Number(req.query.page) : 1
      const size: number = req.query.size !== null && req.query.size !== undefined ? Number(req.query.size) : 10

      // call get all books authors service with pagination
      getAllBooksAuthorsStatus = await GetAllBookAuthors(page, size)
    }

    if (!getAllBooksAuthorsStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...getAllBooksAuthorsStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...getAllBooksAuthorsStatus
    })
  } catch (err) {
    next(err)
  }
}

export { GetAllBookOneAuthors }
