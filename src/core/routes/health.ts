import { Router } from 'express';
import { prisma } from '../database/prisma';
import { config } from '../config/envs';
import type { Request, Response } from 'express';

enum DB_STATUS {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

enum Status {
  OK = 'ok',
  ERROR = 'error',
}

interface HealthCheck {
  status: Status;
  uptime: number;
  timestamp: number;
  environment: string;
  database: DB_STATUS;
}

const router: Router = Router();

router.get('/health', async (req: Request, res: Response) => {
  let dbStatus: DB_STATUS = DB_STATUS.DISCONNECTED;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = DB_STATUS.CONNECTED;
  } catch (error) {}

  const healthCheck: HealthCheck = {
    status: dbStatus === DB_STATUS.CONNECTED ? Status.OK : Status.ERROR,
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: config.server.env,
    database: dbStatus,
  };

  const statusCode = dbStatus === DB_STATUS.CONNECTED ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

export { router as healthRouter };
