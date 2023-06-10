import { connectToDb } from './configs/db.configs'
import app from './index'
import * as dotenv from 'dotenv'

dotenv.config()

// service func to start both db and server
const StartServer = async (): Promise<void> => {
    try {
      // server port
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const PORT: number = parseInt(process.env.PORT!)
      // connect to db
      await connectToDb()
      app.listen(PORT, () => {
        console.log('\x1b[32m', '\n -- SERVER CONNECTION: SUCCESS --\n', '\x1b[0m')
      })
      return
    } catch (err) {
      console.log('\x1b[31m', 'Error while connecting to server...\n', '\x1b[0m', err)
    }
}

// start dev server
StartServer()
  .then(() => {
    console.log('\x1b[32m', '\n -- DATABASE STARTED: SUCCESS --\n', '\x1b[0m')
    console.log('\x1b[32m', '\n -- SERVER STARTED: SUCCESS --\n', '\x1b[0m')
  }).catch((err) => {
    console.log('\x1b[31m', 'Error while starting server & database..\n', '\x1b[0m', err)
  })


  export { StartServer }