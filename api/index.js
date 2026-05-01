require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Content = require('./models/Content');

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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
