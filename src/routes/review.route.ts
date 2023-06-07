import express from 'express'
import { body, param } from 'express-validator'
import passport from '../configs/passport.config'
import { AddOneReview } from '../controllers/reivew.controller'

const router: express.IRouter = express.Router()

// post review
router.post(
  '/:bookid',
  param('bookid')
    .notEmpty()
    .withMessage('Param bookid should not be empty')
    .isNumeric()
    .withMessage('Param bookid should be an integer'),
  body('stars')
    .notEmpty()
    .withMessage('Review Stars should not be empty')
    .isInt({ min: 0, max: 5 })
    .withMessage('Review Stars should be an integer(0-5)'),
  body('message')
    .notEmpty()
    .withMessage('Review message should not be empty')
    .isString()
    .withMessage('Review message should be an integer'),
  // user authencticatin
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  AddOneReview
)

export { router as ReviewRouter }
