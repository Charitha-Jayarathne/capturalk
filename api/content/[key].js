import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jayarathnacharitha5_db_user:5a6TjtgwWQXfwzFJ@cluster0.wz1ijx2.mongodb.net/capturalk?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    isConnected = conn.connections[0].readyState === 1;
    return true;
  } catch (err) {
    console.warn('Vercel Serverless MongoDB Connect Error:', err.message);
    return false;
  }
}

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ success: false, message: 'Content key required' });
  }

  const dbOk = await connectDB();

  if (req.method === 'GET') {
    if (dbOk) {
      try {
        const record = await SiteContent.findOne({ key });
        if (record && record.data) {
          return res.status(200).json({ success: true, data: record.data });
        }
      } catch (err) {
        console.warn(`MongoDB read failed for ${key}:`, err.message);
      }
    }
    return res.status(200).json({ success: true, data: null });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const data = req.body;
    if (data === undefined) {
      return res.status(400).json({ success: false, message: 'Body is required' });
    }
    if (dbOk) {
      try {
        const updated = await SiteContent.findOneAndUpdate(
          { key },
          { key, data },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return res.status(200).json({ success: true, data: updated.data });
      } catch (err) {
        console.error(`MongoDB write error for ${key}:`, err.message);
        return res.status(500).json({ success: false, message: err.message });
      }
    }
    return res.status(503).json({
      success: false,
      message: 'MongoDB Atlas is not accessible. Please ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.'
    });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
