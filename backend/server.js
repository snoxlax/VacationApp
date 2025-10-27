import express from 'express';
import cors from 'cors';
import config from './src/config/index.js';
import authRoutes from './src/routes/auth.js';
import requestRoutes from './src/routes/requests.js';
import { generalLimiter } from './src/middleware/rateLimiter.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();

// Rate limiting middleware
app.use(generalLimiter);

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// Health check endpoint
app.get('/api', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server unless in test environment
if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
    console.log(`CORS Origin: ${config.corsOrigin}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
