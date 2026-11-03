import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import { verifyCloudinaryConnection } from '../config/cloudinary.js';
import mongoose from 'mongoose';

async function testAllConnections() {
  console.log('========================================');
  console.log('🚀 TESTING CAPTURATLK BACKEND CONNECTIONS');
  console.log('========================================');

  console.log('\n[1/2] Testing MongoDB Atlas connection...');
  const mongoConn = await connectDB();
  if (mongoConn) {
    console.log('🎉 MongoDB Atlas is reachable and authenticated!');
  } else {
    console.log('⚠️ MongoDB connection could not be established. Check network or IP whitelist on MongoDB Atlas.');
  }

  console.log('\n[2/2] Testing Cloudinary connection...');
  const cloudRes = await verifyCloudinaryConnection();
  if (cloudRes.success) {
    console.log(`🎉 Cloudinary connection authenticated successfully!`);
  } else {
    console.log(`⚠️ Cloudinary status: ${cloudRes.message}`);
    console.log(`💡 Note: If CLOUDINARY_CLOUD_NAME differs from "${process.env.CLOUDINARY_CLOUD_NAME}", please update it in backend/.env`);
  }

  console.log('\n========================================');
  console.log('Summary check completed.');
  console.log('========================================');

  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
}

testAllConnections();
