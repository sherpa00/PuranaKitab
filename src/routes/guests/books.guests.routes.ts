import { type IRouter, Router } from 'express'
import { param, query } from 'express-validator'
import { GetAllOneBooks, GetBookById } from '../../__tests__/integration/controllers/books.controller'

const router: IRouter = Router()

router.get(
  '/',
  query('genre').optional().isString().withMessage('Query genre should be a string'),
  query('author').optional().isString().withMessage('Query author should be a string'),
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integere'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetAllOneBooks
)

router.get(
  '/:bookid',
  param('bookid').isNumeric().withMessage('Param bookid should be integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetBookById
)

export { router as BookGuestRouter }
