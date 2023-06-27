import type { Request, Response,NextFunction } from 'express'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'
import { type ServiceResponse } from '../types'
import { GetBookGenres } from '../services/genres.service'
import { StatusCodes } from 'http-status-codes'

// controller for getting all book genres
const GetBookOneGenres = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const validationError = validationResult(req)
        if (!validationError.isEmpty()) {
            const error = new CustomError('Validation Error', 403)
            throw error
        }

        let getBookGenresStatus: ServiceResponse
        // req queres 
        let page: any = req.query.page
        let size: any = req.query.size

        if ((page === undefined || page === null) && (size === undefined && size === null)) {
            // pagination is not provided
            // call get book genres service without page and size
            getBookGenresStatus = await GetBookGenres()
        } else {
            // pagination provided either page or size or both
            page = page !== null && page !== undefined ? Number(page) : 1
            size = size !== null && size !== undefined ? Number(size) : 10

            // call get book genres service with page and size
            getBookGenresStatus = await GetBookGenres(page, size)
        }

        if (!getBookGenresStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...getBookGenresStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...getBookGenresStatus
        })


        
    } catch (err) {
        next(err)
    }
}

export {GetBookOneGenres}