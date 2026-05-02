require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Content = require('./models/Content');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: No MONGO_URI provided in .env');
  process.exit(1);
}

const pullDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const data = await Content.findOne({ documentId: 'site_content' });

    if (!data) {
      console.log('❌ No content found in MongoDB for documentId: site_content');
      process.exit(1);
    }

    // Convert to plain object and remove MongoDB specific fields
    const cleanData = data.toObject();
    delete cleanData._id;
    delete cleanData.__v;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;

    const DB_FILE = path.join(__dirname, 'database.json');
    fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8');

    console.log('✅ Successfully pulled MongoDB content to local database.json!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error pulling database:', error);
    process.exit(1);
  }
};

pullDatabase();
