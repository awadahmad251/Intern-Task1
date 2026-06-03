const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const normalizeObjectId = (value) => {
  if (!value) {
    return null;
  }
  return mongoose.Types.ObjectId.isValid(value) ? value : null;
};

router.get('/', requireAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('brand', 'nameEn logoUrl')
      .populate('category', 'nameEn')
      .populate('city', 'name');
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      brand: normalizeObjectId(req.body.brand),
      category: normalizeObjectId(req.body.category),
      city: normalizeObjectId(req.body.city),
    };
    const product = await Product.create(payload);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      brand: normalizeObjectId(req.body.brand),
      category: normalizeObjectId(req.body.category),
      city: normalizeObjectId(req.body.city),
    };
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ message: 'Product deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
