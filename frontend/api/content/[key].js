// Serverless content endpoint for Captura LK
// Gracefully handles GET / PUT for categories, albums, home, about

let inMemoryContent = {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { key } = req.query;

  if (req.method === 'GET') {
    const data = inMemoryContent[key] || null;
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const payload = req.body;
    if (key && payload !== undefined) {
      inMemoryContent[key] = payload;
    }
    return res.status(200).json({ success: true, data: payload });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
