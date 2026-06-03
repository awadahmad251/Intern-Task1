const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {
      type: String,
      default: '',
      validate: {
        validator: (value) => !value || /^\d{11}$/.test(value),
        message: 'Contact number must be exactly 11 digits.',
      },
    },
    cnic: {
      type: String,
      default: '',
      validate: {
        validator: (value) => !value || /^\d{13}$/.test(value),
        message: 'CNIC must be exactly 13 digits.',
      },
    },
    address: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    role: {
      type: String,
      enum: ['admin', 'user', 'sales', 'warehouse', 'retailer', 'coordinator'],
      default: 'user',
    },
    active: { type: Boolean, default: true },
    adminVerified: { type: Boolean, default: false },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
