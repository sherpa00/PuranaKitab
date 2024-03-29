import fs from 'fs'
import express, { type Application, type Request, type Response } from 'express'
import morgan from 'morgan'
import pinoHTTP from 'pino-http'
import StatusCode from 'http-status-codes'
import * as helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import logger from './utils/logger.utils'
import { errorFailSafeHandler, errorLogger, errorResponder } from './middlewares/error-handler.middleware'
import { RootRouter } from './routes'
import dotenv from 'dotenv'

dotenv.config({
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  path: `.env.${process.env.NODE_ENV}`
})

// server application
const app: Application = express()

// helmet conifig for better secure headers
if (process.env.NODE_ENV === 'production') {
  app.use(helmet.default())
}

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

// api docs
const swaggerFile: any = process.cwd() + '/src/swagger/swagger.json'
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf-8')
const swaggerDocs: any = JSON.parse(swaggerData)

// dev purpose only
if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT ?? 3001
  const swaggerHOST: string = 'localhost:' + String(port)
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      swaggerOptions: {
        host: swaggerHOST
      }
    })
  )
}

// root api router
app.use('/', RootRouter)

// custom erorr handler middlewares
app.use(errorLogger)
app.use(errorResponder)
app.use(errorFailSafeHandler)

export default app
