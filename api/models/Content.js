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
  documentId: { type: String, required: true, unique: true },
  general: {
    companyName: String,
    logoText: String,
    logoImage: String,
    brandIcon: String,     // Para el Isotipo (ej: el mundo solo)
    secondaryLogo: String   // Para versiones alternativas (ej: 3D o vertical)
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
  },
  allies: {
    title: String,
    title_translations: { type: Object, default: {} },
    description: String,
    description_translations: { type: Object, default: {} },
    items: [{
      id: String,
      name: String,
      name_translations: { type: Object, default: {} },
      description: String,
      description_translations: { type: Object, default: {} },
      image: String,
      visible: { type: Boolean, default: true }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);
