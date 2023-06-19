/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { connectToDb } from './configs/db.configs'
import app from './index'
import * as dotenv from 'dotenv'
import logger from './utils/logger.utils'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT: number = parseInt(process.env.PORT!)

// start server with db
const server = app.listen(PORT, (async (): Promise<void> => {
  try {
    logger.info('\x1b[32m', '\n -- SERVER CONNECTION: SUCCESS --\n', '\x1b[0m')
    // connect to db
    await connectToDb()
  } catch (err) {
    logger.error(err, '\x1b[31m', 'Error while starting server & database..\n', '\x1b[0m', err)
  }
}) as () => void)

// Handle SIGINT signal to gracefully shut down the server and database
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  logger.info(`Received SIGINT signal from ${process.pid}`)

  // close http server
  const closeServer = new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  try {
    // end http server
    await closeServer
    logger.info('HTTP server closed...')
    // close db
    // await db.end()

    // exit node process
    process.exit(0)
  } catch (err) {
    logger.error(err, 'Error while closing all servers...')
    // Exit the process with an error code
    process.exit(1)
  }
})

process.on('uncaughtException', err => {
  logger.error(err, 'Uncaught Error')
  process.exit(0)
})

export { server }
