import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { verifyCloudinaryConnection } from './config/cloudinary.js';

import bookingRoutes from './routes/bookingRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly permissive CORS
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'CapturaLK Backend API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      bookings: '/api/bookings',
      portfolio: '/api/portfolio',
      upload: '/api/upload',
      auth: '/api/auth',
    },
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server and Establish Connections
const startServer = async () => {
  console.log('⚡ Initializing CapturaLK Backend Server...');

  // Connect MongoDB
  await connectDB();

  // Verify Cloudinary configuration
  await verifyCloudinaryConnection();

  app.listen(PORT, () => {
    console.log(`🚀 CapturaLK Backend is running on http://localhost:${PORT}`);
    console.log(`📡 Health Check endpoint: http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
