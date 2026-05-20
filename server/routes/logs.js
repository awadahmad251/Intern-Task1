const express = require('express');
const Log = require('../models/Log');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const logs = await Log.find().populate('actor', 'name email').sort({ createdAt: -1 });
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch logs.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const log = await Log.create(req.body);
    return res.status(201).json(log);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create log.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found.' });
    }
    return res.json({ message: 'Log deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete log.' });
  }
});

module.exports = router;
