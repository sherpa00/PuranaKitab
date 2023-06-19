import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type userPayload } from '../configs/passport.config';

// middleware to verify if the current authenticated user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // get the authenticated user info from req
  const authenticatedUserData: any | userPayload = req.user;

  if (Boolean(authenticatedUserData.role) && authenticatedUserData.role === 'ADMIN') {
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access',
    });
  }
};

export { isAdmin };
