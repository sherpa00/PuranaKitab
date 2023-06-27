import express, { type IRouter } from 'express'
import { body, param, query } from 'express-validator'
import {
  AddNewBookOneAuthor,
  GetAllBookOneAuthors,
  RemoveOneAuthor,
  UpdateOneAuthor
} from '../controllers/authors.controller'
import passport from '../configs/passport.config'
import { isAdmin } from '../middlewares/admin.middleware'

const router: IRouter = express.Router()

router.get(
  '/',
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetAllBookOneAuthors
)

router.post(
  '/',
  body('firstname')
    .notEmpty()
    .withMessage('Body firstname should not be empty')
    .isString()
    .withMessage('Body firstname should be a string'),
  body('lastname')
    .notEmpty()
    .withMessage('Body lastname should not be empty')
    .isString()
    .withMessage('Body lastname should be a string'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  AddNewBookOneAuthor
)

router.patch(
  '/:authorid',
  param('authorid')
    .notEmpty()
    .withMessage('Param authorid should not be empty')
    .isInt()
    .withMessage('Param authorid should be an integer'),
  body('firstname').optional().isString().withMessage('Body firstname should be a string'),
  body('lastname').optional().isString().withMessage('Body lastname should be a string'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneAuthor
)

router.delete(
  '/:authorid',
  param('authorid')
    .notEmpty()
    .withMessage('Param authorid should not be empty')
    .isInt()
    .withMessage('Param authorid should be an integer'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveOneAuthor
)

export { router as AuthorsRouter }
