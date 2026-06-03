const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    adminVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', citySchema);
