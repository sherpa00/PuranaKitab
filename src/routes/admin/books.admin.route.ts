import express from 'express'
import { body, param, query } from 'express-validator'
import {
  RemoveOneBook,
  UpdateOneBook,
  addOneNewBook,
  AddBookImage,
  UploadBookImage,
  RemoveBookImage,
  UpdateOneBookGenre,
  UpdateOneBookAuthor
} from '../../controllers/books.controller'
import multerStorage from '../../utils/multer.utils'

const router = express.Router()

router.post(
  '/',
  body('title').notEmpty().withMessage('Book Title Should not be empty'),
  body('price').notEmpty().withMessage('Book Price Should not be empty'),
  body('publication_date').notEmpty().withMessage('Book Publication Date Should not be empty'),
  body('book_type').notEmpty().withMessage('Book Type Should not be empty'),
  body('book_condition')
    .notEmpty()
    .withMessage('Book Condition should not be empty')
    .isIn(['GOOD', 'ACCEPTABLE', 'OLD'])
    .withMessage('Book Condition should either be GOOD or ACCEPTABLE or OLD'),
  body('available_quantity').notEmpty().withMessage('Book Available Quantity Should not be empty'),
  body('isbn').notEmpty().withMessage('Book isbn Should not be empty'),
  body('description').optional().isString().withMessage('Book description Should should be string'),
  body('genre').isString().withMessage('Book genre should be a string'),
  body('authorFirstname').notEmpty().withMessage('Book author firstname Should not be empty'),
  body('authorLastname').notEmpty().withMessage('Book author lastname Should not be empty'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  addOneNewBook
)

// route to add book image to book with bookid
router.post(
  '/:bookid/image',
  param('bookid').isInt().withMessage('Param bookid must be integer'),
  query('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'),
  multerStorage.single('bookimage'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  AddBookImage
)

// route to update book image to book with bookid
router.patch(
  '/:bookid/image',
  param('bookid').isInt().withMessage('Param bookid must be integer'),
  query('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'),
  multerStorage.single('bookimage'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UploadBookImage
)

router.patch(
  '/:bookid',
  param('bookid').isNumeric().withMessage('Param bookid should be integer'),
  body('title').optional().isString().withMessage('Book Title Should be string'),
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
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneBook
)

router.patch(
  '/:bookid/author',
  param('bookid').isInt().withMessage('Param bookid should be integer'),
  body('firstname')
    .notEmpty()
    .withMessage('Body firsname should not be empty')
    .isString()
    .withMessage('Body firstname should be a string'),
  body('lastname')
    .notEmpty()
    .withMessage('Body lastname should not be empty')
    .isString()
    .withMessage('Body lastname should be a string'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneBookAuthor
)

router.patch(
  '/:bookid/genre',
  param('bookid').isInt().withMessage('Param bookid should be integer'),
  body('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneBookGenre
)

router.delete(
  '/:bookid',
  param('bookid').isNumeric().withMessage('Param bookid should be integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveOneBook
)

router.delete(
  '/:bookid/image',
  param('bookid').isInt().withMessage('Param bookid must be integer'),
  query('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveBookImage
)

export { router as BookAdminRouter }
