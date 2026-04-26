const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  totalBalance: { type: Number, default: 0 },
  history: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['onboarding', 'manual_deposit', 'transaction_fee'], required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Pre-save check to keep a singleton instance if desired
// But let's just use it like a regular collection and keep one document.

module.exports = mongoose.model('Bank', bankSchema);
