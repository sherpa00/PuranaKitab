import express, { type IRouter } from 'express'
import {
  GetOneCategoryBestSeller,
  GetOneCategoryNewArrivals,
  GetOneCategoryRecentlyAdded,
  GetOneCategoryTopRated
} from '../../controllers/categories.controller'
import { query } from 'express-validator'

const router: IRouter = express.Router()

// category router -> best seller books
router.get(
  '/best-seller',
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneCategoryBestSeller
)

// category router -> top rated
router.get(
  '/top-rated',
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneCategoryTopRated
)

// category router -> new arrivals
router.get(
  '/new-arrivals',
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneCategoryNewArrivals
)

// category router -> recently added
router.get(
  '/recently-added',
  query('page').optional().isInt().withMessage('Query page should be an integer'),
  query('size').optional().isInt().withMessage('Query size should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetOneCategoryRecentlyAdded
)

export { router as CategoriesBestSellerRouter }
