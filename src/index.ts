import fs from 'fs'
import express, { type Application, type Request, type Response } from 'express'
import morgan from 'morgan'
import pinoHTTP from 'pino-http'
import StatusCode from 'http-status-codes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import logger from './utils/logger.utils'
import passport from './configs/passport.config'
import { isAdmin } from './middlewares/admin.middleware'
import { errorFailSafeHandler, errorLogger, errorResponder } from './middlewares/error-handler.middleware'
import { RootRouter } from './routes'

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

// private route for admin
app.get('/api/isadmin', passport.authenticate('jwt', { session: false }), isAdmin, (req: Request, res: Response) => {
  res.status(StatusCode.OK).json({
    success: true,
    message: 'WELCOME ADMIN'
  })
})

// api docs
const swaggerFile: any = (process.cwd() + '/src/swagger/swagger.json')
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf-8')
const swaggerDocs: any = JSON.parse(swaggerData)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// root api router
app.use('/', RootRouter)

// custom erorr handler middlewares
app.use(errorLogger)
app.use(errorResponder)
app.use(errorFailSafeHandler)

export default app
