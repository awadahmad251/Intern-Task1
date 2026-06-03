const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    contactEmail: { type: String, default: '' },
    otpCode: { type: String, default: '' },
    otpExpiresAt: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['processed', 'completed', 'cancelled', 'delivered'],
      default: 'processed',
    },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
