const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true },
    nameUr: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    active: { type: Boolean, default: true },
    adminVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
