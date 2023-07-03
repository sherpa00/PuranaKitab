import Router, {type IRouter} from 'express'
import { SearchRouter } from './search.route'
import { ForgotPasswordRouter } from './forgot-password.route'
import { ResetPasswordRouter } from './reset-password.route'
import { HealthCheckRouter } from './healthCheck'
import { BookGuestRouter } from './books.guests.routes'
import { AuthorGuestRouter } from './authors.guest.route'
import { GenreGuestRouter } from './genres.guest.route'
import { LoginRouter } from './login.route'
import { RegisterRouter } from './register.route'
import { ReviewsGuestRouter } from './reviews.guest.route'


const router: IRouter = Router()
router.use('/register', RegisterRouter)

router.use('/login', LoginRouter)

router.use('/search', SearchRouter)

router.use('/forgot-password', ForgotPasswordRouter)

router.use('/reset-password', ResetPasswordRouter)

router.use('/healthCheck', HealthCheckRouter)

router.use('/books', BookGuestRouter)

router.use('/authors', AuthorGuestRouter)

router.use('/genres', GenreGuestRouter)

router.use('/reviews', ReviewsGuestRouter)



export {router as GuestRouter}