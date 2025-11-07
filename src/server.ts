import { debug } from 'console';
import { app } from './app';
import { config } from './core/config/envs';

const port = config.server.port;

const server = app.listen(port);

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
});
