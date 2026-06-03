const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    message: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    entityType: { type: String, default: '' },
    entityId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
