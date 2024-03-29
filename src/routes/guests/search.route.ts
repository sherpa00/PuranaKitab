import express, { type IRouter } from 'express'
import { query } from 'express-validator'
import { SearchBooksOne } from '../../controllers/search.controller'

const router: IRouter = express.Router()

// search book routes
router.get(
  '/',
  query('query').isString().withMessage('Search query must be a string'),
  query('search_by')
    .isIn(['title', 'author', 'description'])
    .withMessage('Search by must be either title, author or description'),
  query('genre').optional().isString().withMessage('Query genre should be a string'),
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  query('sort_by').optional().isAlpha().withMessage('Query sort_by should be a string'),
  query('condition')
    .optional()
    .isString()
    .withMessage('Query book condition should be a string')
    .isIn(['OLD', 'old', 'GOOD', 'good', 'ACCEPTABLE', 'acceptable'])
    .withMessage('Query book condition must be either old, good or acceptable'),
  query('min_price').optional().isInt().withMessage('Query Min Price should be an integer'),
  query('max_price').optional().isInt().withMessage('Query Max Price should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  SearchBooksOne
)

export { router as SearchRouter }
