import express from 'express'
import {
  GetAllOneBooks,
  GetBookById,
  RemoveOneBook,
  UpdateOneBook,
  addOneNewBook
} from '../controllers/books.controller'
import { body, param } from 'express-validator'
import { isAdmin } from '../middlewares/admin.middleware'
import passport from '../configs/passport.config'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', GetAllOneBooks)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get(
  '/:bookid',
  param('bookid').isNumeric().withMessage('Param bookid should be integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetBookById
)

router.post(
  '/',
  body('title').notEmpty().withMessage('Book Title Should not be empty'),
  body('price').notEmpty().withMessage('Book Price Should not be empty'),
  body('publication_date').notEmpty().withMessage('Book Publication Date Should not be empty'),
  body('book_type').notEmpty().withMessage('Book Type Should not be empty'),
  body('book_condition').notEmpty().withMessage('Book Condition Should not be empty'),
  body('available_quantity').notEmpty().withMessage('Book Available Quantity Should not be empty'),
  body('isbn').notEmpty().withMessage('Book isbn Should not be empty'),
  body('description').optional().isString().withMessage('Book description Should should be string'),
  body('authorFirstname').notEmpty().withMessage('Book author firstname Should not be empty'),
  body('authorLastname').notEmpty().withMessage('Book author lastname Should not be empty'),
  // user authorization
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  addOneNewBook
)

router.patch(
  '/:bookid',
  param('bookid').isNumeric().withMessage('Param bookid should be integer'),
  body('title').optional().isAlphanumeric().withMessage('Book Title Should be string'),
  body('price').optional().isInt().withMessage('Book Price Should be integer'),
  body('publication_date').optional().trim().isDate().withMessage('Book Publication Date Should be valid date'),
  body('book_type').optional().isAlpha().withMessage('Book Type should be string'),
  body('book_condition')
    .optional()
    .isIn(['GOOD', 'ACCEPTABLE', 'OLD'])
    .withMessage('Book Condition should either be GOOD or ACCEPTABLE or OLD'),
  body('available_quantity').optional().isInt().withMessage('Book Available Quantity Should be integer'),
  body('isbn').optional().isAlphanumeric().withMessage('Book isbn Should should be string'),
  body('description').optional().isString().withMessage('Book description Should should be string'),
  // user authorization
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneBook
)

router.delete(
  '/:bookid',
  param('bookid').isNumeric().withMessage('Param bookid should be integer'),
  // user authorization
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveOneBook
)

export { router as BookRouter }
