import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import authRoutes from './backend/routes/authRoutes.js';
import queueRoutes from './backend/routes/queueRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';
import { queueController } from './backend/controllers/queueController.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(express.json());

  // API Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Top level convenient routes
  app.get('/api/doctors', queueController.getDoctors);
  app.get('/api/departments', queueController.getDepartments);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/queue', queueRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/.*/', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(` Smart Hospital Queue Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
