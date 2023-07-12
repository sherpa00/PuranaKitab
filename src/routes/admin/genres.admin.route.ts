import express, { type IRouter } from 'express'
import { body, param } from 'express-validator'
import { AddBookOneGenre, DeleteOneGenre, UpdateOneGenre } from '../../__tests__/integration/controllers/genres.controller'

const router: IRouter = express.Router()

router.post(
  '/',
  body('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'),
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
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  DeleteOneGenre
)

export { router as GenresAdminRouter }
