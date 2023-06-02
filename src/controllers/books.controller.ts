import type { Request, Response, NextFunction } from 'express'
import {
  AddBook,
  GetAllBooks,
  type BookStatusInfo,
  GetOnlyOneBook,
  UpdateBook,
  type NewBookPayload,
  RemoveBookWithId,
  AddBookImg,
  UpdateBookImg
} from '../services/books.service'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'

// controller for getting all books
const GetAllOneBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const getAllBooksStatus: BookStatusInfo = await GetAllBooks()

    if (!getAllBooksStatus.success) {
      const error = new CustomError('No Books found', 403)
      throw error
    }

    res.status(StatusCodes.OK).json({
      ...getAllBooksStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for getting a book by id
const GetBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // input validation errors
    const BookGetErrors = validationResult(req)

    if (!BookGetErrors.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    const getBookByIdStatus: BookStatusInfo = await GetOnlyOneBook(parseInt(req.params.bookid))

    if (!getBookByIdStatus.success) {
      const error = new CustomError('No Book withd id: ' + req.params.bookid + ' found', 404)
      throw error
    }

    res.status(StatusCodes.OK).json({
      ...getBookByIdStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for adding new book
const addOneNewBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // input validation
    const BookInputErrors = validationResult(req)

    if (!BookInputErrors.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
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
      description,
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
        isbn,
        description
      },
      authorFirstname,
      authorLastname
    )

    if (!addNewBookStatus.success) {
      const error = new CustomError('Internal server error', 500)
      throw error
    }

    res.status(StatusCodes.OK).json({
      ...addNewBookStatus
    })
  } catch (err) {
    next(err)
  }
}

// contrller for updating a book
const UpdateOneBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validatino errors
    const BookUpdateErrors = validationResult(req)

    if (!BookUpdateErrors.isEmpty()) {
      const error = new CustomError('Validation error', 403)
      throw error
    }

    const { bookid } = req.params

    const newBookBody: Partial<NewBookPayload> = req.body

    // call the update book service
    const updateOneBookStatus = await UpdateBook(parseInt(bookid), newBookBody)

    if (!updateOneBookStatus.success) {
      const error = new CustomError('Internal server error', 500)
      throw error
    }

    res.status(StatusCodes.OK).json({
      ...updateOneBookStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for removing a book
const RemoveOneBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const BookDeleteError = validationResult(req)

    if (!BookDeleteError.isEmpty()) {
      const error = new CustomError('Validation error', 403)
      throw error
      /*
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation Error',
        errors: BookDeleteError.array()
      })
      return */
    }

    const { bookid } = req.params

    // call remove book service
    const removeBookStatus = await RemoveBookWithId(parseInt(bookid))

    if (!removeBookStatus.success) {
      const error = new CustomError('Internal server error', 500)
      throw error
      /*
      res.status(StatusCodes.BAD_REQUEST).json({
        ...removeBookStatus
      })
      return */
    }

    res.status(StatusCodes.OK).json({
      ...removeBookStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for adding book images
const AddBookImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validationn errors
    const BookInputErrors = validationResult(req)

    if (!BookInputErrors.isEmpty()) {
      const errors = new CustomError('Validation Error', 403)
      throw errors
    }

    // get the image local path
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const localImagePath = req.file?.path ?? ''

    // params and query
    const bookid: number = parseInt(req.params.bookid)
    const bookImgType: string = String(req.query.type).toUpperCase()

    // upload the image by calling upload image service
    const imageCloudUploadStatus: BookStatusInfo = await AddBookImg(bookid, localImagePath, bookImgType)

    if (!imageCloudUploadStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...imageCloudUploadStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...imageCloudUploadStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for adding book images
const UploadBookImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation errors
    const BookInputErrors = validationResult(req)

    if (!BookInputErrors.isEmpty()) {
      const errors = new CustomError('Validation Error', 403)
      throw errors
    }

    // get the image local path
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const localImagePath = req.file?.path ?? ''

    // params and query
    const bookid: number = parseInt(req.params.bookid)
    const bookImgType: string = String(req.query.type).toUpperCase()

    // upload the image by calling upload image service
    const imageCloudUpdateStatus: BookStatusInfo = await UpdateBookImg(bookid, localImagePath, bookImgType)

    if (!imageCloudUpdateStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...imageCloudUpdateStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...imageCloudUpdateStatus
    })
  } catch (err) {
    next(err)
  }
}
export { addOneNewBook, GetAllOneBooks, GetBookById, UpdateOneBook, RemoveOneBook, AddBookImage, UploadBookImage }
