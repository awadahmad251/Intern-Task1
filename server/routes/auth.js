const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'karyana-jwt-secret-v1';

const normalizeDigits = (value, maxLength) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return String(value).replace(/\D/g, '').slice(0, maxLength);
};

const validateContactFields = (phone, cnic) => {
  if (phone && !/^\d{11}$/.test(phone)) {
    return 'Contact number must be exactly 11 digits.';
  }
  if (cnic && !/^\d{13}$/.test(cnic)) {
    return 'CNIC must be exactly 13 digits.';
  }
  return '';
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl || '',
  phone: user.phone || '',
  cnic: user.cnic || '',
  address: user.address || '',
  city: user.city || null,
});

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, phone, cnic, address, city, avatarUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const normalizedPhone = normalizeDigits(phone, 11);
    const normalizedCnic = normalizeDigits(cnic, 13);
    const contactError = validateContactFields(normalizedPhone, normalizedCnic);
    if (contactError) {
      return res.status(400).json({ message: contactError });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || 'user',
      phone: normalizedPhone,
      cnic: normalizedCnic,
      address,
      city,
      avatarUrl,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Missing authorization token.' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
