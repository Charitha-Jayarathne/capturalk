import express from 'express';
import mongoose from 'mongoose';
import { verifyCloudinaryConnection } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const cloudinaryStatus = await verifyCloudinaryConnection();

  const isHealthy = mongoStatus === 'connected' && cloudinaryStatus.success;

  res.status(isHealthy ? 200 : 207).json({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      mongodb: {
        status: mongoStatus,
        host: mongoose.connection.host || 'unknown',
        database: mongoose.connection.name || 'unknown',
      },
      cloudinary: cloudinaryStatus,
    },
  });
});

export default router;
