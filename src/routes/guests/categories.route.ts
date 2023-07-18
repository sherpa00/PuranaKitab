import express, {type IRouter} from 'express'
import { GetOneCategoryBestSeller } from '../../controllers/categories.controller'
import { query } from 'express-validator'

const router: IRouter = express.Router()

router.get(
    '/best-seller',
    query('page')
        .optional()
        .isInt().withMessage('Query page should be an integer'),
    query('size')
        .optional()
        .isInt().withMessage('Query size should be an integer'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    GetOneCategoryBestSeller
)

export {router as CategoriesBestSellerRouter}