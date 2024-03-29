import express from 'express'
import { body, param } from 'express-validator'
import { RemoveAllOneBookReviews, RemoveSingleOneBookReview } from '../../controllers/reivew.controller'
import { isAdmin } from '../../middlewares/admin.middleware'
import passport from '../../configs/passport.config'

const router: express.IRouter = express.Router()

// get single reviews
router.delete(
  '/:reviewid',
  param('reviewid').isNumeric().withMessage('Param reviewid should be an integer'),
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveSingleOneBookReview
)

// get all reviews
router.delete(
  '/',
  body('bookid')
    .notEmpty()
    .withMessage('Body bookid should not be empty')
    .isNumeric()
    .withMessage('Body bookid should be an integer'),
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  RemoveAllOneBookReviews
)

export { router as ReviewsAdminRouter }
