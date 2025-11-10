import { Router } from 'express';
import { healthRouter } from './health';
import { userRouter } from '../../modules/users/user.router';
import { authRouter } from '../../modules/auth/auth.router';

export const router: Router = Router();

const API_V1_PREFIX = '/api/v1';

router.use(`${API_V1_PREFIX}`, healthRouter);
router.use(`${API_V1_PREFIX}`, userRouter);
router.use(`${API_V1_PREFIX}`, authRouter);

export { router as rootRouter };
