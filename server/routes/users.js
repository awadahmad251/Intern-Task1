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

const normalizeDigits = (value, maxLength) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return String(value).replace(/\D/g, '').slice(0, maxLength);
};

const validateContactFields = (payload) => {
  if (payload.phone && !/^\d{11}$/.test(payload.phone)) {
    return 'Contact number must be exactly 11 digits.';
  }
  if (payload.cnic && !/^\d{13}$/.test(payload.cnic)) {
    return 'CNIC must be exactly 13 digits.';
  }
  return '';
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
    const payload = {
      ...req.body,
      phone: normalizeDigits(req.body.phone, 11),
      cnic: normalizeDigits(req.body.cnic, 13),
      city: normalizeObjectId(req.body.city),
    };
    console.log('[users] create attempt by:', req.user?.email || req.user?.id || 'unknown');
    console.log('[users] payload:', { ...payload, password: payload.password ? '***REDACTED***' : undefined });

    // basic validation with clear errors
    if (!payload.name || !payload.email || (!payload.password && !payload._id)) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const allowedRoles = ['admin', 'user', 'sales', 'warehouse', 'retailer', 'coordinator'];
    if (payload.role && !allowedRoles.includes(payload.role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}` });
    }
    if (payload.password) {
      // Ensure password is hashed from a string to avoid bcrypt errors.
      payload.password = await bcrypt.hash(String(payload.password), 10);
    }

    const contactError = validateContactFields(payload);
    if (contactError) {
      return res.status(400).json({ message: contactError });
    }

    const user = await User.create(payload);
    const safeUser = user.toObject();
    delete safeUser.password;
    return res.status(201).json(safeUser);
  } catch (error) {
    console.error('[users] create error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message || 'Invalid user data.' });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    const details = {
      name: error?.name,
      code: error?.code,
      message: error?.message,
    };
    return res.status(500).json({
      message: error?.message || 'Failed to create user.',
      details,
    });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      phone: normalizeDigits(req.body.phone, 11),
      cnic: normalizeDigits(req.body.cnic, 13),
      city: normalizeObjectId(req.body.city),
    };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const contactError = validateContactFields(payload);
    if (contactError) {
      return res.status(400).json({ message: contactError });
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
