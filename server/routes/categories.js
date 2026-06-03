const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/Category');
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
    const categories = await Category.find().populate('city', 'name');
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body, city: normalizeObjectId(req.body.city) };
    const category = await Category.create(payload);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create category.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body, city: normalizeObjectId(req.body.city) };
    const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update category.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete category.' });
  }
});

module.exports = router;
