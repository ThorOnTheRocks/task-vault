import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './core/config/envs';
import { rootRouter } from './core/routes';
import { notFoundError, serverError } from './core/middlewares/error-handler';

export const app = express();

// Security
app.use(helmet());
app.use(cors());
// Logging
app.use(morgan(config.server.env === 'production' ? 'combined' : 'dev'));
// Body Parsing
app.use(json());

app.use(rootRouter);
// 5. 404 handler (after all routes)
app.use(notFoundError);
// 6. Error handler (must be last)
app.use(serverError);
