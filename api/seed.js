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

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const DB_FILE = path.join(__dirname, 'database.json');
    const rawData = fs.readFileSync(DB_FILE, 'utf8');
    const localData = JSON.parse(rawData);

    await Content.findOneAndUpdate(
      { documentId: 'site_content' },
      localData,
      { new: true, upsert: true }
    );

    console.log('Successfully seeded MongoDB with local database.json content!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
