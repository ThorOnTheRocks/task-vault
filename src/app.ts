import express from 'express';
import { json } from 'express';

export const app = express();

app.use(json());
