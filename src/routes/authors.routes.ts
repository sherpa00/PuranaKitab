import express, { type IRouter } from 'express'
import { body, query } from 'express-validator'
import { AddNewBookOneAuthor, GetAllBookOneAuthors } from '../controllers/authors.controller'
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
        .notEmpty().withMessage('Body firstname should not be empty')
        .isString().withMessage('Body firstname should be a string'),
    body('lastname')
        .notEmpty().withMessage('Body lastname should not be empty')
        .isString().withMessage('Body lastname should be a string'),
    // user authentication
    passport.authenticate('jwt', {session: false}),
    // admin authorization
    isAdmin,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    AddNewBookOneAuthor
)

export { router as AuthorsRouter }
