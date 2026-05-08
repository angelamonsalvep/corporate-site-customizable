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
const CLIENT_ID = process.env.CLIENT_ID || 'default_site';
const DB_NAME = process.env.DB_NAME || CLIENT_ID;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_PARAMS = process.env.MONGO_PARAMS || 'retryWrites=true&w=majority';

// Construir la URI completa
const MONGO_URI = MONGO_URL ? `${MONGO_URL}${DB_NAME}?${MONGO_PARAMS}` : null;

const DEFAULT_CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || `clientes/${CLIENT_ID}`;

// Helper to translate text using Google Translate free API
const https = require('https');
async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let translatedText = '';
          if (json && json[0]) {
            json[0].forEach(part => translatedText += part[0]);
          }
          resolve(translatedText || text);
        } catch (e) {
          console.error('Translation parse error:', e);
          resolve(text); // Fallback to original text on error
        }
      });
    }).on('error', (e) => {
      console.error('Translation network error:', e);
      resolve(text);
    });
  });
}

// Connection helper for Serverless
async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return true;
  if (!MONGO_URI) return false;
  
  try {
    await mongoose.connect(MONGO_URI);
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
}

// Initial connection for local dev
if (MONGO_URI) {
  ensureConnected();
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Get current content
app.get('/api/content', async (req, res) => {
  try {
    const isConnected = await ensureConnected();

    if (isConnected) {
      let data = await Content.findOne({ documentId: CLIENT_ID });
      if (data) {
        return res.json(data);
      }
      
      // Fallback si no hay datos en la colección
      console.log(`[Fallback] Cliente ${CLIENT_ID} no encontrado en MongoDB. Cargando desde archivo local.`);
      const clientSeed = path.join(__dirname, 'seeds', `${CLIENT_ID}.json`);
      const genericSeed = path.join(__dirname, 'seeds', 'generic.json');
      const seedToUse = fs.existsSync(clientSeed) ? clientSeed : genericSeed;
      
      const rawData = fs.readFileSync(seedToUse, 'utf8');
      data = JSON.parse(rawData);
      res.json(data);
    } else {
      // Sin MongoDB (solo desarrollo local)
      console.log(`[Local] Sin conexión a MongoDB. Usando archivos locales.`);
      const clientSeed = path.join(__dirname, 'seeds', `${CLIENT_ID}.json`);
      const genericSeed = path.join(__dirname, 'seeds', 'generic.json');
      const seedToUse = fs.existsSync(clientSeed) ? clientSeed : genericSeed;
      
      const rawData = fs.readFileSync(seedToUse, 'utf8');
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

    // Auto-translate allies dynamic content
    if (newContent.allies) {
      const targetLangs = ['en', 'fr', 'pt', 'zh'];
      
      const translateObject = async (text) => {
        if (!text) return {};
        const results = {};
        for (const lang of targetLangs) {
          results[lang] = await translateText(text, lang);
        }
        return results;
      };

      if (newContent.allies.title) {
        newContent.allies.title_translations = await translateObject(newContent.allies.title);
      }
      if (newContent.allies.description) {
        newContent.allies.description_translations = await translateObject(newContent.allies.description);
      }
      
      if (newContent.allies.items && Array.isArray(newContent.allies.items)) {
        for (const item of newContent.allies.items) {
          if (item.name) {
            item.name_translations = await translateObject(item.name);
          }
          if (item.description) {
            item.description_translations = await translateObject(item.description);
          }
        }
      }
    }

    const isConnected = await ensureConnected();

    if (isConnected) {
      // Asegurar que el documento guardado tenga el ID correcto
      newContent.documentId = CLIENT_ID;
      
      await Content.findOneAndUpdate(
        { documentId: CLIENT_ID },
        newContent,
        { returnDocument: 'after', upsert: true }
      );
      // Backup local si es posible (fallará en Vercel, pero lo ignoramos)
      try { 
        const clientSeedPath = path.join(__dirname, 'seeds', `${CLIENT_ID}.json`);
        fs.writeFileSync(clientSeedPath, JSON.stringify(newContent, null, 2), 'utf8'); 
      } catch(e){}
      res.json({ success: true, message: 'Content updated in MongoDB' });
    } else {
      // Si estamos en Vercel y no hay DB, es un error fatal
      if (process.env.VERCEL) {
        throw new Error('Database not connected. Check MONGO_URI in Vercel settings.');
      }
      // Solo permitimos escritura local si NO estamos en Vercel
      fs.writeFileSync(DB_FILE, JSON.stringify(newContent, null, 2), 'utf8');
      res.json({ success: true, message: 'Content updated locally' });
    }
  } catch (error) {
    console.error('Error writing database:', error);
    res.status(500).json({ 
      error: 'Failed to save content',
      details: error.message || error.toString(),
      isVercel: !!process.env.VERCEL,
      hasMongoUri: !!MONGO_URI,
      dbState: mongoose.connection.readyState
    });
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
    res.status(500).json({ 
      error: 'Failed to fetch images from Cloudinary', 
      details: error.message || error.toString(),
      hasKeys: !!process.env.CLOUDINARY_API_KEY // Debug helper
    });
  }
});

// Endpoint para que el Frontend sepa su config
app.get('/api/config', (req, res) => {
  res.json({
    clientId: CLIENT_ID,
    defaultCloudinaryFolder: DEFAULT_CLOUDINARY_FOLDER
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
