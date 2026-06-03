const express = require('express');
const mongoose = require('mongoose');
const Banner = require('../models/Banner');
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
    const banners = await Banner.find().populate('city', 'name');
    return res.json(banners);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch banners.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body, city: normalizeObjectId(req.body.city) };
    const banner = await Banner.create(payload);
    return res.status(201).json(banner);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create banner.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body, city: normalizeObjectId(req.body.city) };
    const banner = await Banner.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    return res.json(banner);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update banner.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    return res.json({ message: 'Banner deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete banner.' });
  }
});

module.exports = router;
