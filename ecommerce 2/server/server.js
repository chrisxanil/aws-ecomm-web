import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDatabase, db } from './database/db.js';
import { getCloudStatus } from './config/aws-config.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Security & utility middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Root Index
app.get(['/api', '/api/'], (req, res) => {
  res.status(200).json({
    success: true,
    service: 'NexaCart AI REST API',
    version: '1.0.0',
    dbEngine: db.getEngine(),
    endpoints: {
      health: '/api/health',
      cloudStatus: '/api/cloud-status',
      products: '/api/products',
      categories: '/api/products/categories',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile'
      },
      orders: {
        create: 'POST /api/orders',
        myOrders: 'GET /api/orders/my',
        adminAll: 'GET /api/orders/admin/all'
      },
      analytics: 'GET /api/analytics/dashboard',
      ai: 'POST /api/ai/recommend'
    },
    clientApp: 'http://localhost:5173'
  });
});

// Liveness & Readiness Health Probe (For AWS Elastic Beanstalk, EC2, Kubernetes)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbEngine: db.getEngine()
  });
});

// AWS Cloud Integration Status Endpoint
app.get('/api/cloud-status', (req, res) => {
  res.status(200).json({
    success: true,
    ...getCloudStatus(),
    dbEngine: db.getEngine()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// In production, serve the built frontend assets if hosted together
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint ${req.path} not found.`
    });
  }
  // Serve index.html for SPA router if client dist exists
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>NexaCart AI Backend</title></head>
        <body style="font-family:sans-serif; background:#0b0f19; color:#f8fafc; padding:2rem; text-align:center;">
          <h1 style="color:#818cf8;">⚡ NexaCart AI API Server is Running</h1>
          <p>Database Engine: <strong>${db.getEngine().toUpperCase()}</strong></p>
          <p>Health Probe: <a style="color:#38bdf8;" href="/api/health">/api/health</a></p>
          <p>Cloud Status: <a style="color:#38bdf8;" href="/api/cloud-status">/api/cloud-status</a></p>
          <p>Products Endpoint: <a style="color:#38bdf8;" href="/api/products">/api/products</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Central error handler
app.use(errorHandler);

// Bootstrap Database and Start Server
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 NexaCart AI Server is active on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`💓 Health:   http://localhost:${PORT}/api/health`);
    console.log(`☁️ Cloud:    http://localhost:${PORT}/api/cloud-status`);
    console.log(`🗄️ Database: [${db.getEngine().toUpperCase()}]`);
    console.log(`======================================================\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
