const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Order = require('../models/Order');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRetailers = await User.countDocuments({ role: 'retailer' });
    const totalSales = await User.countDocuments({ role: 'sales' });
    const totalWarehouse = await User.countDocuments({ role: 'warehouse' });

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();

    const totalOrdersCompleted = await Order.countDocuments({ status: 'completed' });
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

    return res.json({
      totalUsers,
      totalRetailers,
      totalSales,
      totalWarehouse,
      totalProducts,
      totalCategories,
      totalBrands,
      totalOrdersCompleted,
      totalRevenue,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load stats.' });
  }
});

module.exports = router;
