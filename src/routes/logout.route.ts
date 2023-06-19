import express from 'express';
import { LogOutOne } from '../controllers/logout.controller';
import passport from '../configs/passport.config';

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  LogOutOne,
);

export { router as LogoutRouter };
