import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import CustomError from "../utils/custom-error"

const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    try {
        console.error('\x1b[31m', err) // adding colors to error
        next(err)
    } catch (err) {
        console.log(err)
        console.log('Error while logging errors')
    }
}

const errorResponder = (err: CustomError | Error, req: Request, res: Response, next: NextFunction): void => {
    try {

        const statusCode = err instanceof CustomError ? err.statusCode : 500
        res.status(statusCode)

        res.json({
            success: false,
            error: {
                message: err.message
            }
        })
    } catch (err) {
        console.log(err)
        console.log('Error while responding to errors')
    }
}

const errorFailSafeHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    try {
        
        // checking if response is already sent
         if(res.headersSent) {
            next(err)
         }

         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: {
                message: 'Internal Server Error'
            }
         })

    } catch (err) {
        console.log(err)
        console.log('Error while fail safe handling errors')
    }
}



export {
    errorLogger,
    errorResponder,
    errorFailSafeHandler
}