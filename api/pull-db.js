const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const Content = require('./models/Content');

const CLIENT_ID = process.env.CLIENT_ID || 'default_site';
const DB_NAME = process.env.DB_NAME || CLIENT_ID;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_PARAMS = process.env.MONGO_PARAMS || 'retryWrites=true&w=majority';

const MONGO_URI = MONGO_URL ? `${MONGO_URL}${DB_NAME}?${MONGO_PARAMS}` : null;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URL not provided in .env');
  process.exit(1);
}

const pullDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB Database: ${DB_NAME}`);

    const data = await Content.findOne({ documentId: CLIENT_ID });

    if (!data) {
      console.log(`❌ No content found in MongoDB for documentId: ${CLIENT_ID}`);
      process.exit(1);
    }

    // Convert to plain object and remove MongoDB specific fields
    const cleanData = data.toObject();
    delete cleanData._id;
    delete cleanData.__v;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;

    const DB_FILE = path.join(__dirname, 'seeds', `${CLIENT_ID}.json`);
    fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8');

    console.log(`✅ Successfully pulled MongoDB content to local seeds/${CLIENT_ID}.json!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error pulling database:', error);
    process.exit(1);
  }
};

pullDatabase();
