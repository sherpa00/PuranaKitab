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

    // req.query
    const searchQuery: string = String(req.query.query)
    const searchBy: string = String(req.query.search_by)
    const searchGenre: any = req.query.genre
    const searchPage: number = req.query.page !== null && req.query.page !== undefined ? Number(req.query.page) : 1
    const searchSize: number = req.query.size !== null && req.query.size !== undefined ? Number(req.query.size) : 10
    const searchSortBy: string =
      req.query.sort_by != null && req.query.sort_by !== undefined ? String(req.query.sort_by) : 'most_reviewed'
    const searchBookCondition: any =
      req.query.condition !== null && req.query.condition !== undefined
        ? String(req.query.condition).toUpperCase()
        : req.query.condition
    const searchMinPrice: any =
      req.query.min_price !== null && req.query.min_price !== undefined
        ? Number(req.query.min_price)
        : req.query.min_price
    const searchMaxPrice: any =
      req.query.max_price !== null && req.query.max_price !== undefined
        ? Number(req.query.max_price)
        : req.query.max_price

    // call search books service
    const searchBooksStatus: ServiceResponse = await SearchBooks(
      searchQuery,
      searchBy,
      searchGenre,
      searchPage,
      searchSize,
      searchSortBy,
      searchBookCondition,
      searchMinPrice,
      searchMaxPrice
    )

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
