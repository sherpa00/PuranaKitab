import { Router, type IRouter } from 'express'
import { body } from 'express-validator'
import { GetAllOneBookReview } from '../../controllers/reivew.controller'

const router: IRouter = Router()

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

export {router as ReviewsGuestRouter}