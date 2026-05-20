const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'awadk251@gmail.com';
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const router = express.Router();

const normalizeObjectId = (value) => {
  if (!value) {
    return null;
  }
  return mongoose.Types.ObjectId.isValid(value) ? value : null;
};

const generateOrderId = () => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${Date.now()}-${suffix}`;
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { retailer: req.user?.id || null };
    const orders = await Order.find(filter).select('-otpCode')
      .populate('retailer', 'name')
      .populate('city', 'name')
      .populate('items.product', 'nameEn');
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const retailerId = isAdmin ? normalizeObjectId(req.body.retailer) : req.user?.id;
    const contactEmail = req.body.contactEmail || req.user?.email;
    if (!contactEmail) {
      return res.status(400).json({ message: 'Contact email is required.' });
    }

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const payload = {
      ...req.body,
      orderId: req.body.orderId || generateOrderId(),
      retailer: retailerId,
      contactEmail,
      otpCode,
      otpExpiresAt,
      otpVerified: false,
      city: normalizeObjectId(req.body.city),
      items: (req.body.items || []).map((item) => ({
        ...item,
        product: normalizeObjectId(item.product),
      })),
    };
    const order = await Order.create(payload);
    console.log(`[order otp] ${order.orderId} -> ${otpCode} for ${contactEmail}`);

    // attempt to send OTP email via SendGrid when configured
    let emailSent = false;
    if (SENDGRID_API_KEY) {
      try {
        const msg = {
          to: contactEmail,
          from: FROM_EMAIL,
          subject: `Your OTP for order ${order.orderId}`,
          text: `Your OTP is ${otpCode}. It expires in 10 minutes.`,
          html: `<p>Your OTP is <strong>${otpCode}</strong>.</p><p>It will expire at ${otpExpiresAt.toLocaleString()}.</p>`,
        };
        await sgMail.send(msg);
        emailSent = true;
      } catch (err) {
        console.error('SendGrid send error:', err?.response?.body || err);
        emailSent = false;
      }
    }

    const safeOrder = order.toObject();
    delete safeOrder.otpCode;
    return res.status(201).json({ ...safeOrder, otpSent: emailSent });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      retailer: normalizeObjectId(req.body.retailer),
      city: normalizeObjectId(req.body.city),
      items: (req.body.items || []).map((item) => ({
        ...item,
        product: normalizeObjectId(item.product),
      })),
    };
    const order = await Order.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.json({ message: 'Order deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete order.' });
  }
});

module.exports = router;
