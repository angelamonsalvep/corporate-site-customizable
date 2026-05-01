const path = require('path');
const fs = require('fs');

// Manual .env loader to avoid dotenvx interference
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && key.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '');
    }
  });
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Content = require('./models/Content');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'database.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Get current content
app.get('/api/content', async (req, res) => {
  try {
    if (MONGO_URI && mongoose.connection.readyState === 1) {
      let data = await Content.findOne({ documentId: 'site_content' });
      if (!data) {
        const rawData = fs.readFileSync(DB_FILE, 'utf8');
        data = JSON.parse(rawData);
      }
      res.json(data);
    } else {
      const rawData = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(rawData);
      res.json(data);
    }
  } catch (error) {
    console.error('Error reading database:', error);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

// Verify Password endpoint
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
  }
});

// Update content
app.post('/api/content', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: 'No autorizado. Contraseña incorrecta.' });
    }

    const newContent = req.body;
    
    // Basic validation
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Invalid content format' });
    }

    if (MONGO_URI && mongoose.connection.readyState === 1) {
      await Content.findOneAndUpdate(
        { documentId: 'site_content' },
        newContent,
        { new: true, upsert: true }
      );
      // Backup local si es posible
      try { fs.writeFileSync(DB_FILE, JSON.stringify(newContent, null, 2), 'utf8'); } catch(e){}
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(newContent, null, 2), 'utf8');
    }
    
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error writing database:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.get('/api/cloudinary-gallery', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: 'No autorizado.' });
    }

    const { folder } = req.query;
    let searchExpression = 'resource_type:image';
    if (folder) {
      searchExpression += ` AND folder="${folder}"`;
    }

    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    res.json({ success: true, images: result.resources });
  } catch (error) {
    console.error('Error fetching from Cloudinary:', error);
    res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
