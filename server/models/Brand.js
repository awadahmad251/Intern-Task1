const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true },
    nameUr: { type: String, default: '' },
    commission: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    logoUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
    adminVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
