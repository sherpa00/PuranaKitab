import express, {type IRouter} from 'express'
import { query } from 'express-validator'
import { GetBookOneGenres } from '../controllers/genres.controller'

const router: IRouter = express.Router()

router.get(
    '/',
    query('page')
        .optional()
        .isInt().withMessage('Query page should be an integer'),
    query('size')
        .optional()
        .isInt().withMessage('Query size should be an integer'),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    GetBookOneGenres
)

export {router as GenresRouter}

