import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/custom-error';
import logger from '../utils/logger.utils';

const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.error(err); // adding colors to error
    next(err);
  } catch (err1) {
    logger.error(err1, 'Error while loggin errors');
  }
};

const errorResponder = (err: CustomError | Error, req: Request, res: Response, next: NextFunction): void => {
  try {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    res.status(statusCode);

    res.json({
      success: false,
      error: {
        message: err.message,
      },
    });
  } catch (err1) {
    logger.error(err1, 'Error while responding to errors');
  }
};

const errorFailSafeHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  try {
    // checking if response is already sent
    if (res.headersSent) {
      next(err);
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: 'Internal Server Error',
      },
    });
  } catch (err1) {
    logger.error(err1, 'Error while fail safe error handling');
  }
};

export { errorLogger, errorResponder, errorFailSafeHandler };
