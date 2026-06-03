const express = require('express');
const City = require('../models/City');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    return res.json(cities);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch cities.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const city = await City.create(req.body);
    return res.status(201).json(city);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create city.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }
    return res.json(city);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update city.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }
    return res.json({ message: 'City deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete city.' });
  }
});

module.exports = router;
