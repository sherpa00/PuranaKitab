import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import logger from '../utils/logger.utils'

dotenv.config({
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  path: `.env.${process.env.NODE_ENV}`
})

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
    logger.info('\n -- DATABASE CONNECTION: SUCCESS --\n')
  } catch (err) {
    logger.error(err, 'Error while connecting to server database..\n')
  }
}

const disconnectToDb = async (): Promise<void> => {
  try {
    await db.end()
    logger.info('\n -- DATABASE DISCONNECTION: SUCCESS --\n')
  } catch (err) {
    logger.error(err, 'Error while disconnecting to server database..\n')
  }
}

export { db, connectToDb, disconnectToDb }
