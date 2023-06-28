import express, { type IRouter } from 'express'
import { body, param, query } from 'express-validator'
import { AddBookOneGenre, DeleteOneGenre, GetBookOneGenres, UpdateOneGenre } from '../controllers/genres.controller'
import passport from '../configs/passport.config'
import { isAdmin } from '../middlewares/admin.middleware'

const router: IRouter = express.Router()

router.get(
  '/',
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetBookOneGenres
)

router.post(
  '/',
  body('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  AddBookOneGenre
)

router.patch(
  '/:genreid',
  param('genreid')
    .notEmpty()
    .withMessage('Param genreid should not be empty')
    .isInt()
    .withMessage('Param genreid should be an integer'),
  body('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'),
  // user authentication
  passport.authenticate('jwt', { session: false }),
  // admin authorization
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UpdateOneGenre
)

router.delete(
    '/:genreid',
    param('genreid')
      .notEmpty()
      .withMessage('Param genreid should not be empty')
      .isInt()
      .withMessage('Param genreid should be an integer'),
    // user authentication
    passport.authenticate('jwt', { session: false }),
    // admin authorization
    isAdmin,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    DeleteOneGenre
  )

export { router as GenresRouter }
