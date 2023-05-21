import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  port: parseInt(process.env.DB_PORT!)
})

const connectToDb = async (): Promise<void> => {
  try {
    await db.connect()
    console.log('Successfully connected to database...')
  } catch (err) {
    console.log(err)
    console.log('Error while connecting to server database..')
  }
}

export { db, connectToDb }
