import dotenv from 'dotenv';
dotenv.config();

export const config = {
  server: {
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
};
