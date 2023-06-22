import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'
import type { ServiceResponse } from '../types'
import { SearchBooks } from '../services/search.service'
import { StatusCodes } from 'http-status-codes'

// contoller for searching books
const SearchBooksOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    const searchQuery: string = String(req.query.query)
    const searchBy: string = String(req.query.search_by)
    const searchPage: number = (req.query.page !== null && req.query.page !== undefined) ? Number(req.query.page) : 1
    const searchLimit: number = (req.query.limit !== null && req.query.limit !== undefined) ? Number(req.query.limit) : 10

    // call search books service
    const searchBooksStatus: ServiceResponse = await SearchBooks(searchQuery, searchBy, searchPage, searchLimit)

    if (!searchBooksStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...searchBooksStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...searchBooksStatus
    })
  } catch (err) {
    next(err)
  }
}

export { SearchBooksOne }
