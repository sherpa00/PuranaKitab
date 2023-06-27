import express, {type IRouter} from 'express'
import { body, query } from 'express-validator'
import { AddBookOneGenre, GetBookOneGenres } from '../controllers/genres.controller'
import passport from '../configs/passport.config'
import { isAdmin } from '../middlewares/admin.middleware'

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

router.post(
    '/',
    body('genre')
        .notEmpty().withMessage('Body genre should not be empty')
        .isString().withMessage('Body genre should be a string'),
    // user authentication
    passport.authenticate('jwt', {session: false}),
    // admin authorization
    isAdmin,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    AddBookOneGenre
)

export {router as GenresRouter}

