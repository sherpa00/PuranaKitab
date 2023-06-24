import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import {
  AddBook,
  GetAllBooks,
  GetOnlyOneBook,
  UpdateBook,
  type NewBookPayload,
  RemoveBookWithId,
  AddBookImg,
  UpdateBookImg,
  DeleteBookImage,
  UpdateBookGenre
} from '../services/books.service'
import type { ServiceResponse } from '../types'
import CustomError from '../utils/custom-error'

// controller for getting all books
const GetAllOneBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // invalidation error
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // get books results
    let getAllBooksStatus: ServiceResponse

    if (
      (req.query.page === null || req.query.page === undefined) &&
      (req.query.size === null || req.query.size === undefined)
    ) {
      // pagination is not provied
      // call get all books without pagination
      getAllBooksStatus = await GetAllBooks()
    } else {
      // pagination provided either page or limt or both
      const page: number = req.query.page !== null && req.query.page !== undefined ? Number(req.query.page) : 1
      const size: number = req.query.size !== null && req.query.size !== undefined ? Number(req.query.size) : 10

      // call get all books service with pagination
      getAllBooksStatus = await GetAllBooks(page, size)
    }

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

    const getBookByIdStatus: ServiceResponse = await GetOnlyOneBook(parseInt(req.params.bookid))

    if (!getBookByIdStatus.success) {
      const error = new CustomError(`No Book withd id: ${req.params.bookid} found`, 404)
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
      genre,
      authorFirstname,
      authorLastname
    } = req.body

    // call the add new book service with payload
    const addNewBookStatus: ServiceResponse = await AddBook(
      {
        title,
        price,
        publication_date,
        book_type,
        book_condition,
        available_quantity,
        isbn,
        description,
        genre
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
    const updateOneBookStatus: ServiceResponse = await UpdateBook(parseInt(bookid), newBookBody)

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

// controller for updating book genre
const UpdateOneBookGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { 
    // validation error
     const validationError = validationResult(req)
     if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
     }

     // req.params and req.body
     const bookid: number = Number(req.params.bookid)
     const newGenre: string = req.body.genre

     // call update book genre
     const updateBookGenreStatus: ServiceResponse = await UpdateBookGenre(newGenre, bookid)

     if (!updateBookGenreStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...updateBookGenreStatus
      })
      return
     }

     res.status(StatusCodes.OK).json({
      ...updateBookGenreStatus
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
    }

    const bookid: number = parseInt(req.params.bookid)

    // call remove book service
    const removeBookStatus: ServiceResponse = await RemoveBookWithId(bookid)

    if (!removeBookStatus.success) {
      const error = new CustomError('Internal server error', 500)
      throw error
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
    const imageCloudUploadStatus: ServiceResponse = await AddBookImg(bookid, localImagePath, bookImgType)

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
    const imageCloudUpdateStatus: ServiceResponse = await UpdateBookImg(bookid, localImagePath, bookImgType)

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

// controller to remove book images
const RemoveBookImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation errors
    const BookInputErrors = validationResult(req)

    if (!BookInputErrors.isEmpty()) {
      const errors = new CustomError('Validation Error', 403)
      throw errors
    }

    // get params and query
    const bookid: number = parseInt(req.params.bookid)
    const imgType: string = String(req.query.type).toUpperCase()

    // call remove book image service
    const removeBookStatus: ServiceResponse = await DeleteBookImage(bookid, imgType)

    if (!removeBookStatus.success) {
      const errors = new CustomError(removeBookStatus.message, StatusCodes.BAD_REQUEST)
      throw errors
    }

    res.status(StatusCodes.OK).json({
      ...removeBookStatus
    })
  } catch (err) {
    next(err)
  }
}
export {
  addOneNewBook,
  GetAllOneBooks,
  GetBookById,
  UpdateOneBook,
  UpdateOneBookGenre,
  RemoveOneBook,
  AddBookImage,
  UploadBookImage,
  RemoveBookImage
}
