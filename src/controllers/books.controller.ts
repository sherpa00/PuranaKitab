import type { Request, Response, NextFunction } from 'express'
import { AddBook, type BookStatusInfo } from '../services/books.service'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'

// controller for adding new book
const addOneNewBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // input validation
    const BookInputErrors = validationResult(req)

    if (!BookInputErrors.isEmpty()) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Input Validation Error',
        errors: BookInputErrors.array()
      })
      return
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      title,
      price,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      publication_date,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      book_type,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      book_condition,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      available_quantity,
      isbn,
      authorFirstname,
      authorLastname
    } = req.body

    // call the add new book service with payload
    const addNewBookStatus: BookStatusInfo = await AddBook(
      {
        title,
        price,
        publication_date,
        book_type,
        book_condition,
        available_quantity,
        isbn
      },
      authorFirstname,
      authorLastname
    )

    if (!addNewBookStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...addNewBookStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...addNewBookStatus
    })
  } catch (err) {
    console.log(err)
    console.log('Error while adding new book')
    next(err)
  }
}

export { addOneNewBook }
