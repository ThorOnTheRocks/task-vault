import { app } from './app';
import { config } from './core/config/envs';

const port = config.server.port;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
