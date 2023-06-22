import express, { type IRouter } from 'express'
import { query } from 'express-validator'
import { SearchBooksOne } from '../controllers/search.controller'

const router: IRouter = express.Router()

// search book routes
router.get(
  '/',
  query('query').isString().withMessage('Search query must be a string'),
  query('search_by')
    .isIn(['title', 'author', 'description'])
    .withMessage('Search by must be eiterh title, author or description'),
  query('page')
    .optional()
    .isInt().withMessage('Query page should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  SearchBooksOne
)

export { router as SearchRouter }
