import express, { type Application, type Request, type Response } from 'express'
import morgan from 'morgan'
import StatusCode from 'http-status-codes'
import { registerRouter } from './routes/register.route'
import { loginRouter } from './routes/login.route'
import passport from './configs/passport.config'
import { UserRouter } from './routes/user.route'
import { BookRouter } from './routes/books.routes'

// server application
const app: Application = express()

// middlewares for server handling
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// root rotue for checking server functioning
app.get('/', (req: Request, res: Response): void => {
  try {
    res.status(StatusCode.OK).json({
      success: true,
      message: 'Api server is alive'
    })
  } catch (err) {
    console.log(err)
    res.status(StatusCode.BAD_REQUEST).json({
      success: false,
      message: 'Api server Error'
    })
  }
})

// private route for testing authorizations
app.get('/private', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
  res.status(StatusCode.OK).json({
    success: true,
    message: 'Authorization Success',
    data: req.user
  })
})

// register new user
app.use('/register', registerRouter)
app.use('/login', loginRouter)

// user routes
app.use('/user', passport.authenticate('jwt', { session: false }), UserRouter)

// book routes
app.use('/books', passport.authenticate('jwt', { session: false }), BookRouter)

export default app
