import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { getBar, getLine, getPie, getStats } from '../controllers/stats.js';

const app = express.Router();

app.get("/stats", adminOnly, getStats);

app.get("/pie", adminOnly, getPie);

app.get("/line", adminOnly, getLine);

app.get("/bar", adminOnly, getBar);

export default app;