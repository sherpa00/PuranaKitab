import type { Request, Response, NextFunction } from 'express'
import CustomError from '../utils/custom-error'
import { validationResult } from 'express-validator'
import { type ServiceResponse } from '../types'
import {
  GetCategoriesBestSeller,
  GetCategoriesNewArrivals,
  GetCategoriesRecentlyAdded,
  GetCategoriesTopRated
} from '../services/categories.service'
import { StatusCodes } from 'http-status-codes'

// category controller -> Best Seller books
const GetOneCategoryBestSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const invalidationError = validationResult(req)

    if (!invalidationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req.queires for pagination page and size
    const page: number = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1
    const size: number = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10

    // call the get best seller service
    const getBestSeller: ServiceResponse = await GetCategoriesBestSeller(page, size)

    if (!getBestSeller.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...getBestSeller
      })
    } else {
      res.status(StatusCodes.OK).json({
        ...getBestSeller
      })
    }
  } catch (err) {
    next(err)
  }
}

// category controller -> Top Rated
const GetOneCategoryTopRated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const invalidationError = validationResult(req)

    if (!invalidationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req.queires for pagination page and size
    const page: number = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1
    const size: number = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10

    // call the get top rated service
    const getTopRated: ServiceResponse = await GetCategoriesTopRated(page, size)

    if (!getTopRated.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...getTopRated
      })
    } else {
      res.status(StatusCodes.OK).json({
        ...getTopRated
      })
    }
  } catch (err) {
    next(err)
  }
}

// category controller -> new arrivals books
const GetOneCategoryNewArrivals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const invalidationError = validationResult(req)

    if (!invalidationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req.queires for pagination page and size
    const page: number = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1
    const size: number = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10

    // call the get new arrivals service
    const getNewArrivals: ServiceResponse = await GetCategoriesNewArrivals(page, size)

    if (!getNewArrivals.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...getNewArrivals
      })
    } else {
      res.status(StatusCodes.OK).json({
        ...getNewArrivals
      })
    }
  } catch (err) {
    next(err)
  }
}

// category controller -> recently added books
const GetOneCategoryRecentlyAdded = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const invalidationError = validationResult(req)

    if (!invalidationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req.queires for pagination page and size
    const page: number = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1
    const size: number = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10

    // call the get recently added service
    const getRecentlyAdded: ServiceResponse = await GetCategoriesRecentlyAdded(page, size)

    if (!getRecentlyAdded.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...getRecentlyAdded
      })
    } else {
      res.status(StatusCodes.OK).json({
        ...getRecentlyAdded
      })
    }
  } catch (err) {
    next(err)
  }
}

export { GetOneCategoryBestSeller, GetOneCategoryTopRated, GetOneCategoryNewArrivals, GetOneCategoryRecentlyAdded }
