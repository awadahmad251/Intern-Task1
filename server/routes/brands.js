const express = require('express');
const mongoose = require('mongoose');
const Brand = require('../models/Brand');
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
    const brands = await Brand.find()
      .populate('category', 'nameEn')
      .populate('city', 'name');
    return res.json(brands);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch brands.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      category: normalizeObjectId(req.body.category),
      city: normalizeObjectId(req.body.city),
    };
    const brand = await Brand.create(payload);
    return res.status(201).json(brand);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create brand.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      category: normalizeObjectId(req.body.category),
      city: normalizeObjectId(req.body.city),
    };
    const brand = await Brand.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    return res.json(brand);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update brand.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    return res.json({ message: 'Brand deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete brand.' });
  }
});

module.exports = router;
