const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  image: String
});

const ServiceSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  image: String,
  visible: { type: Boolean, default: true },
  items: [String]
});

const ContentSchema = new mongoose.Schema({
  documentId: { type: String, default: 'site_content', unique: true },
  general: {
    companyName: String,
    logoText: String,
    logoImage: String
  },
  hero: {
    title: String,
    subtitle: String,
    backgroundImage: String
  },
  about: {
    title: String,
    description: [String],
    image: String
  },
  trade: {
    title: String,
    description: String,
    products: [ProductSchema]
  },
  financial: {
    title: String,
    description: String,
    services: [ServiceSchema]
  },
  contact: {
    whatsappNumber: String,
    email: String,
    phoneDisplay: String,
    address: String,
    showWhatsApp: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);
