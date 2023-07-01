import express, { type Application, type Request, type Response } from 'express'
import morgan from 'morgan'
import pinoHTTP from 'pino-http'
import StatusCode from 'http-status-codes'
import cors from 'cors'
import logger from './utils/logger.utils'
import { registerRouter } from './routes/register.route'
import { loginRouter } from './routes/login.route'
import passport from './configs/passport.config'
import { UserRouter } from './routes/user.route'
import { BookRouter } from './routes/books.routes'
import { LogoutRouter } from './routes/logout.route'
import { isAdmin } from './middlewares/admin.middleware'
import { errorFailSafeHandler, errorLogger, errorResponder } from './middlewares/error-handler.middleware'
import { CartRouter } from './routes/cart.route'
import { ReviewRouter } from './routes/review.route'
import { HealthCheckRouter } from './routes/healthCheck'
import { ForgotPasswordRouter } from './routes/forgot-password.route'
import { ResetPasswordRouter } from './routes/reset-password.route'
import { SearchRouter } from './routes/search.route'
import { AuthorsRouter } from './routes/authors.routes'
import { GenresRouter } from './routes/genres.routes'

// server application
const app: Application = express()

// middlewares for server handling
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cors config
app.use(cors())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

if (process.env.NODE_ENV === 'production') {
  app.use(
    pinoHTTP({
      logger,
      serializers: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        req: req => `-> ${req.method} ${req.url}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        res: res => `<- ${res.statusCode} ${res.headers['content-type']}`
      }
    })
  )
}

// root rotue for checking server functioning
app.get('/api', (req: Request, res: Response): void => {
  try {
    res.status(StatusCode.OK).json({
      success: true,
      message: 'Api server is alive'
    })
  } catch (err) {
    logger.error(err, 'Error in / route')
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Api server Error'
    })
  }
})

// private route for testing authorizations
app.get('/api/private', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
  res.status(StatusCode.OK).json({
    success: true,
    message: 'Authorization Success',
    data: req.user
  })
})

// health check
app.use('/api/healthcheck', HealthCheckRouter)

// private route for admin
app.get('/api/isadmin', passport.authenticate('jwt', { session: false }), isAdmin, (req: Request, res: Response) => {
  res.status(StatusCode.OK).json({
    success: true,
    message: 'WELCOME ADMIN'
  })
})

// register new user
app.use('/api/register', registerRouter)
// login user
app.use('/api/login', loginRouter)
// logout user
app.use('/api/logout', LogoutRouter)

// user routes
app.use('/api/users', passport.authenticate('jwt', { session: false }), UserRouter)

// forgot passwrod routes
app.use('/api/forgot-password', ForgotPasswordRouter)
// reset passoword routes
app.use('/api/reset-password', ResetPasswordRouter)

// book routes
app.use('/api/books', BookRouter)

// search books routes
app.use('/api/search', SearchRouter)

// cart routes
app.use('/api/carts', CartRouter)

// book reviews
app.use('/api/reviews', ReviewRouter)

// book authors
app.use('/api/authors', AuthorsRouter)

// book genres
app.use('/api/genres', GenresRouter)

// custom erorr handler middlewares
app.use(errorLogger)
app.use(errorResponder)
app.use(errorFailSafeHandler)

export default app
