import { Router, type IRouter } from 'express'
import { BookAdminRouter } from './books.admin.route'
import { AuthorsAdminRouter } from './authors.admin.route'
import { GenresAdminRouter } from './genres.admin.route'
import { ReviewsAdminRouter } from './reviews.admin.route'

const router: IRouter = Router()

router.use('/books', BookAdminRouter)

router.use('/authors', AuthorsAdminRouter)

router.use('/genres', GenresAdminRouter)

router.use('/reviews', ReviewsAdminRouter)

export { router as AdminRouter }
