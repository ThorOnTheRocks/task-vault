import { Router, type Request, type Response } from 'express';

const router: Router = Router();
const API_V1_PREFIX = '/api/v1';

router.use(API_V1_PREFIX);
