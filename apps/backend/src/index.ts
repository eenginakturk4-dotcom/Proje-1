import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { authRouter } from './routes/auth.routes.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { adminRouter } from './routes/admin.routes.js';

export const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and requests with no origin (like mobile apps, curl, etc.)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in learning environment
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    name: 'Shoppy REST API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api', catalogRouter);
app.use('/api/cart', cartRouter);
app.use('/api', ordersRouter);
app.use('/api/admin', adminRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

// Start Server (only if not imported by test runner)
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`
🚀 Shoppy API Server running!
📡 URL: http://localhost:${config.port}
🩺 Health Check: http://localhost:${config.port}/api/health
    `);
  });
}
