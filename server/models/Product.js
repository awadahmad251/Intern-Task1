const mongoose = require('mongoose');

const packingSchema = new mongoose.Schema(
  {
    size: { type: String, default: '' },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const bulkOrderSchema = new mongoose.Schema(
  {
    minQty: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const discountSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true },
    nameUr: { type: String, default: '' },
    code: { type: String, default: '' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    adminVerified: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    descriptionUr: { type: String, default: '' },
    packings: { type: [packingSchema], default: [] },
    bulkOrders: { type: [bulkOrderSchema], default: [] },
    discount: { type: discountSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
