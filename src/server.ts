import { connectToDb } from './configs/db.configs'
import app from './index'
import * as dotenv from 'dotenv'

dotenv.config()

// server port
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT: number = parseInt(process.env.PORT!)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen(PORT, async (): Promise<void> => {
  try {
    console.log('Successfully connected to server at port 3003')
    await connectToDb()
  } catch (err) {
    console.log(err)
    console.log('Some error occured while connecting to server')
  }
})
