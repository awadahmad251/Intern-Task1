const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    altText: { type: String, default: '' },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    active: { type: Boolean, default: true },
    adminVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
