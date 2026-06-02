const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const Content = require('./models/Content');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const CLIENT_ID = process.env.CLIENT_ID || 'default_site';
const DB_NAME = process.env.DB_NAME || CLIENT_ID;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_PARAMS = process.env.MONGO_PARAMS || 'retryWrites=true&w=majority';

const MONGO_URI = MONGO_URL ? `${MONGO_URL}${DB_NAME}?${MONGO_PARAMS}` : null;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URL not provided in .env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const force = process.argv.includes('--force');
    const existingContent = await Content.findOne({ documentId: CLIENT_ID });

    if (existingContent && !force) {
      console.log(`⚠️  Database [${DB_NAME}] already contains content for ${CLIENT_ID}. Skipping seed.`);
      console.log('💡 Use "node seed.js --force" if you really want to overwrite MongoDB with the seed file.');
      process.exit(0);
    }

    // Buscar archivo específico del cliente o el genérico
    const clientSeed = path.join(__dirname, 'seeds', `${CLIENT_ID}.json`);
    const genericSeed = path.join(__dirname, 'seeds', 'generic.json');
    const seedToUse = fs.existsSync(clientSeed) ? clientSeed : genericSeed;

    console.log(`🌱 Seeding using: ${path.basename(seedToUse)}`);
    const rawData = fs.readFileSync(seedToUse, 'utf8');
    const localData = JSON.parse(rawData);

    // Generar contraseña inicial segura
    const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(initialPassword, 10);

    // Asegurarse de que el documentId coincida con el CLIENT_ID actual
    localData.documentId = CLIENT_ID;
    
    // Configuración de seguridad inicial
    localData.adminConfig = {
      passwordHash: passwordHash,
      securityQuestion: "¿Cuál es el nombre de la empresa?",
      securityAnswerHash: passwordHash
    };

    await Content.findOneAndUpdate(
      { documentId: CLIENT_ID },
      localData,
      { returnDocument: 'after', upsert: true }
    );

    console.log(`✅ Successfully seeded MongoDB [${DB_NAME}] with ${path.basename(seedToUse)} content!`);
    console.log('\n' + '='.repeat(50));
    console.log('🔐 CREDENCIALES DE ADMINISTRADOR INICIALES');
    console.log('='.repeat(50));
    console.log(`PASSWORD: ${initialPassword}`);
    console.log('='.repeat(50));
    console.log('⚠️  IMPORTANTE: Guarda esta contraseña y cámbiala en el panel /admin');
    console.log('='.repeat(50) + '\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
