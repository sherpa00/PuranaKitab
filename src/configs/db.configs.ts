import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import logger from '../utils/logger.utils';

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  port: parseInt(process.env.DB_PORT!),
});

const connectToDb = async (): Promise<void> => {
  try {
    await db.connect();
    logger.info('\x1b[32m', '\n -- DATABASE CONNECTION: SUCCESS --\n', '\x1b[0m');
  } catch (err) {
    logger.error(err, '\x1b[31m', 'Error while connecting to server database..\n', '\x1b[0m');
  }
};

const disconnectToDb = async (): Promise<void> => {
  try {
    await db.end();
    logger.info('\x1b[32m', '\n -- DATABASE DISCONNECTION: SUCCESS --\n', '\x1b[0m');
  } catch (err) {
    logger.error(err, '\x1b[31m', 'Error while disconnecting to server database..\n', '\x1b[0m');
  }
};

export { db, connectToDb, disconnectToDb };
