const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const normalizeObjectId = (value) => {
  if (!value) {
    return null;
  }
  return mongoose.Types.ObjectId.isValid(value) ? value : null;
};

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('city', 'name');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body, city: normalizeObjectId(req.body.city) };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    const user = await User.create(payload);
    const safeUser = user.toObject();
    delete safeUser.password;
    return res.status(201).json(safeUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    return res.status(500).json({ message: error.message || 'Failed to create user.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body, city: normalizeObjectId(req.body.city) };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    return res.status(500).json({ message: error.message || 'Failed to update user.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ message: 'User deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
});

module.exports = router;
