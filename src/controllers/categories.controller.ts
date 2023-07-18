import type { Request, Response, NextFunction } from 'express'
import CustomError from '../utils/custom-error'
import { validationResult } from 'express-validator'
import { type ServiceResponse } from '../types'
import { GetCategoriesBestSeller } from '../services/categories.service'
import { StatusCodes } from 'http-status-codes'

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

export {GetOneCategoryBestSeller}