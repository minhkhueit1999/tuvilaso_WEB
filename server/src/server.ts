import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to DB (or graceful in-memory fallback)
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`[Tử Vi Minh Khuê] Server running on http://localhost:${PORT}`);
    console.log(`[Healthcheck] http://localhost:${PORT}/api/health`);
  });

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch(err => {
    console.error('Fatal bootstrap error:', err);
  });
}
