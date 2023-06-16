/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { connectToDb } from './configs/db.configs'
import app from './index'
import * as dotenv from 'dotenv'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT: number = parseInt(process.env.PORT!)

// start server with db
const server = app.listen(PORT, (async (): Promise<void> => {
  try {
    console.log('\x1b[32m', '\n -- SERVER CONNECTION: SUCCESS --\n', '\x1b[0m')
    // connect to db
    await connectToDb()
  } catch (err) {
    console.log('\x1b[31m', 'Error while starting server & database..\n', '\x1b[0m', err)
  }
}) as () => void)

// Handle SIGINT signal to gracefully shut down the server and database
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  console.log(`Received SIGINT signal from ${process.pid}`)

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
    console.log('Http server closed')

    // end db server
    // await db.end()
    // console.log('DB server closed')

    // Exit the process with a success code
    process.exit(0)
  } catch (err) {
    console.error('Error while closing the database connection:', err)
    // Exit the process with an error code
    process.exit(1)
  }
})

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err)
  process.exit(0)
})

export { server }
