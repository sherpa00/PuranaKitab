import { connectToDb } from './configs/db.configs'
import app from './index'
import * as dotenv from 'dotenv'
import type { IDbServer } from './types'

dotenv.config()

// server port
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT: number = parseInt(process.env.PORT!)

// service func to start both db and server
const StartServer = async (serverPort: number, dbOptions?: IDbServer): Promise<void> => {
    try {
      // connect to db
      await connectToDb()
      app.listen(serverPort, () => {
        console.log('\x1b[32m', '\n -- SERVER CONNECTION: SUCCESS --\n', '\x1b[0m')
      })
      return
    } catch (err) {
      console.log('\x1b[31m', 'Error while connecting to server...\n', '\x1b[0m', err)
    }
}

// start dev server
StartServer(PORT)
  .then(() => {
    console.log('\x1b[32m', '\n -- DATABASE STARTED: SUCCESS --\n', '\x1b[0m')
    console.log('\x1b[32m', '\n -- SERVER STARTED: SUCCESS --\n', '\x1b[0m')
  }).catch((err) => {
    console.log('\x1b[31m', 'Error while starting server & database..\n', '\x1b[0m', err)
  })


// eslint-disable-next-line @typescript-eslint/no-misused-promises
/*
app.listen(PORT, async (): Promise<void> => {
  try {
    console.log('Successfully connected to server at port 3003')
    await connectToDb()
  } catch (err) {
    console.log(err)
    console.log('Some error occured while connecting to server')
  }
})
*/