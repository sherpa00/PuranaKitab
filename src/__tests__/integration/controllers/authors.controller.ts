import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import CustomError from '../../../utils/custom-error'
import { type ServiceResponse } from '../../../types'
import { AddNewBookAuthor, GetAllBookAuthors, RemoveAuthor, UpdateAuthor } from '../../../services/authors.service'

// funciton to capitalize
export const capitalize = <T extends string>(word: T): string => {
  return word[0].toUpperCase() + word.slice(1)
}

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
      // pagination provided either page or size or both
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

// controller for adding new book author
const AddNewBookOneAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req body -> sanitize it to lowercase and capitalize
    const firsname: string = capitalize(String(req.body.firstname).toLowerCase())
    const lastname: string = capitalize(String(req.body.lastname).toLowerCase())

    // call add new book author service
    const addNewBookAuthorStatus: ServiceResponse = await AddNewBookAuthor(firsname, lastname)

    if (!addNewBookAuthorStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...addNewBookAuthorStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...addNewBookAuthorStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for updating book author
const UpdateOneAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req.params
    const authorID: number = Number(req.params.authorid)

    // req body -> capitalize if defined
    let newFirstname = req.body.firstname
    let newLastname = req.body.lastname

    if (req.body.firstname !== null && req.body.firstname !== undefined) {
      newFirstname = capitalize(String(newFirstname).toLowerCase())
    }

    if (req.body.lastname !== null && req.body.lastname !== undefined) {
      newLastname = capitalize(String(newLastname).toLowerCase())
    }

    // call update book author service
    const updateBookAuthorStatus: ServiceResponse = await UpdateAuthor(authorID, newFirstname, newLastname)

    if (!updateBookAuthorStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...updateBookAuthorStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...updateBookAuthorStatus
    })
  } catch (err) {
    next(err)
  }
}

// controller for removing book author
const RemoveOneAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // validation error
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const error = new CustomError('Validation Error', 403)
      throw error
    }

    // req params
    const authorID: number = Number(req.params.authorid)

    // call remove author service
    const removeAuthorStatus: ServiceResponse = await RemoveAuthor(authorID)

    if (!removeAuthorStatus.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        ...removeAuthorStatus
      })
      return
    }

    res.status(StatusCodes.OK).json({
      ...removeAuthorStatus
    })
  } catch (err) {
    next(err)
  }
}

export { GetAllBookOneAuthors, AddNewBookOneAuthor, UpdateOneAuthor, RemoveOneAuthor }
