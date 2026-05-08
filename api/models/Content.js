const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  name_translations: { type: Object, default: {} },
  description: String,
  description_translations: { type: Object, default: {} },
  image: String
});

const ServiceSchema = new mongoose.Schema({
  id: String,
  name: String,
  name_translations: { type: Object, default: {} },
  description: String,
  description_translations: { type: Object, default: {} },
  image: String,
  visible: { type: Boolean, default: true },
  items: [String],
  items_translations: { type: Object, default: {} } // Object mapping lang -> array of strings
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
    title_translations: { type: Object, default: {} },
    subtitle: String,
    subtitle_translations: { type: Object, default: {} },
    backgroundImage: String
  },
  about: {
    title: String,
    title_translations: { type: Object, default: {} },
    description: [String],
    description_translations: { type: Object, default: {} }, // lang -> array
    image: String
  },
  trade: {
    title: String,
    title_translations: { type: Object, default: {} },
    description: String,
    description_translations: { type: Object, default: {} },
    products: [ProductSchema]
  },
  financial: {
    title: String,
    title_translations: { type: Object, default: {} },
    description: String,
    description_translations: { type: Object, default: {} },
    services: [ServiceSchema]
  },
  contact: {
    whatsappNumber: String,
    whatsappLabel: String,
    whatsappLabel_translations: { type: Object, default: {} },
    whatsappMessage: String,
    whatsappMessage_translations: { type: Object, default: {} },
    secondaryWhatsappNumber: String,
    secondaryWhatsappLabel: String,
    secondaryWhatsappLabel_translations: { type: Object, default: {} },
    secondaryWhatsappMessage: String,
    secondaryWhatsappMessage_translations: { type: Object, default: {} },
    email: String,
    phoneDisplay: String,
    secondaryPhoneDisplay: String,
    address: String,
    showWhatsApp: { type: Boolean, default: true },
    showSecondaryWhatsApp: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: true },
    showSecondaryPhone: { type: Boolean, default: false }
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
  },
  adminConfig: {
    passwordHash: String,
    securityQuestion: String,
    securityAnswerHash: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);
