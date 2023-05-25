import express from 'express'
import { addOneNewBook } from '../controllers/books.controller'
import { body } from 'express-validator'

const router = express.Router()

router.post(
  '/',
  body('title').notEmpty().withMessage('Book Title Should not be empty'),
  body('price').notEmpty().withMessage('Book Price Should not be empty'),
  body('publication_date').notEmpty().withMessage('Book Publication Date Should not be empty'),
  body('book_type').notEmpty().withMessage('Book Type Should not be empty'),
  body('book_condition').notEmpty().withMessage('Book Condition Should not be empty'),
  body('available_quantity').notEmpty().withMessage('Book Available Quantity Should not be empty'),
  body('isbn').notEmpty().withMessage('Book isbn Should not be empty'),
  body('authorFirstname').notEmpty().withMessage('Book author firstname Should not be empty'),
  body('authorLastname').notEmpty().withMessage('Book author lastname Should not be empty'),

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  addOneNewBook
)

export { router as BookRouter }
