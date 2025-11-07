import { Router } from 'express';
import { healthRouter } from './health';

export const router: Router = Router();

const API_V1_PREFIX = '/api/v1';

router.use(`${API_V1_PREFIX}`, healthRouter);

export { router as rootRouter };
