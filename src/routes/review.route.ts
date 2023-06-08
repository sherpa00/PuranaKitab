import express from 'express'
import { body } from 'express-validator'
import passport from '../configs/passport.config'
import { AddOneReview, GetAllOneBookReview, RemoveAllOneBookReviews } from '../controllers/reivew.controller'
import { isAdmin } from '../middlewares/admin.middleware'

const router: express.IRouter = express.Router()

// get all reviews
router.get(
  '/',
  body('bookid')
    .notEmpty()
    .withMessage('Body bookid should not be empty')
    .isNumeric()
    .withMessage('Body bookid should be an integer'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  GetAllOneBookReview
)

// post review
router.post(
  '/',
  body('bookid')
    .notEmpty()
    .withMessage('bookid should not be empty')
    .isNumeric()
    .withMessage('bookid should be an integer'),
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

// get all reviews
router.delete(
    '/',
    body('bookid')
      .notEmpty()
      .withMessage('Body bookid should not be empty')
      .isNumeric()
      .withMessage('Body bookid should be an integer'),
      // user authorization
      passport.authenticate('jwt',{session: false}),
      // admin authorization
      isAdmin,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    RemoveAllOneBookReviews
  )

export { router as ReviewRouter }
