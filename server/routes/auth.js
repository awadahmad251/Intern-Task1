const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET env var is not set. Using insecure default.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'karyana-jwt-secret-v1';

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  return next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
