const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple request logger to help debug frontend API calls
app.use((req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const redacted = auth ? (auth.startsWith('Bearer ') ? `Bearer ${auth.slice(7, 15)}...` : 'present') : 'none';
    console.log(`[req] ${req.method} ${req.path} - Authorization: ${redacted}`);
  } catch (e) {
    // ignore logging errors
  }
  return next();
});

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploads');
const userRoutes = require('./routes/users');
const cityRoutes = require('./routes/cities');
const categoryRoutes = require('./routes/categories');
const brandRoutes = require('./routes/brands');
const productRoutes = require('./routes/products');
const bannerRoutes = require('./routes/banners');
const orderRoutes = require('./routes/orders');
const logRoutes = require('./routes/logs');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intern_task1';
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  // Ensure an admin user exists (seed)
  const bcrypt = require('bcryptjs');
  const User = require('./models/User');

  (async () => {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@karyana.local';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Karyana@123';
      const hashed = await bcrypt.hash(adminPassword, 10);
      const result = await User.findOneAndUpdate(
        { email: adminEmail },
        {
          $set: {
            name: 'Administrator',
            password: hashed,
            role: 'admin',
            adminVerified: true,
            avatarUrl: 'https://i.pravatar.cc/150?img=12',
          },
          $setOnInsert: {
            email: adminEmail,
          },
        },
        { upsert: true, new: true }
      );
      console.log(`Seeded admin user: ${result.email}`);
    } catch (err) {
      console.error('Failed to seed admin user', err);
    }
  })();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
const uploadsDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!process.env.VERCEL) {
  app.use('/uploads', express.static(uploadsDir));
}
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logs', logRoutes);

if (require.main === module && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

module.exports = app;