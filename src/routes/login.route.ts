import express from 'express';
import { body } from 'express-validator';
import LoginOne from '../controllers/login.controller';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post(
  '/',
  body('email').notEmpty().withMessage('Email should not be empty'),
  body('password').notEmpty().withMessage('Password should not be empty'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  LoginOne,
);

export { router as loginRouter };
