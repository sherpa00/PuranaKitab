import express, { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import logger from '../../utils/logger.utils'

const router = express.Router()

// health check info
export interface IHealthCheckInfo {
  uptime: number
  responsetime: [number, number]
  message: string
  timestamp: number
}

router.get('/', (req: Request, res: Response): void => {
  // health json
  const healthCheckInfo: IHealthCheckInfo = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'Good Health',
    timestamp: Date.now()
  }

  try {
    res.status(StatusCodes.OK).json({
      ...healthCheckInfo
    })
  } catch (err: Error | any) {
    logger.error(err)
    healthCheckInfo.message = err.message
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({})
  }
})

export { router as HealthCheckRouter }
