const Transaction = require('../models/transaction.model');
const Expense = require('../models/expense.model');

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ payer: req.user.userId }, { payee: req.user.userId }]
    })
      .populate('payer', 'name')
      .populate('payee', 'name')
      .sort('-createdAt');

    res.json({ transactions });
  } catch (err) { next(err); }
};

exports.settleDebt = async (req, res, next) => {
  try {
    const { payeeId, amount, groupId, method } = req.body;
    
    // Convert undefined to null or omit the field if groupId is not provided
    const transactionData = {
      payer: req.user.userId,
      payee: payeeId,
      amount: parseFloat(amount),
      paymentMethod: method || 'manual',
      status: 'completed'
    };
    if (groupId) transactionData.group = groupId;

    if (method === 'wallet') {
      const User = require('../models/user.model');
      const payer = await User.findById(req.user.userId);
      const payee = await User.findById(payeeId);

      if (!payer || !payee) return res.status(404).json({ error: 'User not found' });
      if (payer.walletBalance < amount) {
        return res.status(400).json({ error: 'Insufficient wallet balance' });
      }

      payer.walletBalance -= amount;
      payee.walletBalance += amount;
      await payer.save();
      await payee.save();
    }

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({ transaction });
  } catch (err) { next(err); }
};

exports.getUserBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Calculate total paid by user
    const paidAggregation = await Expense.aggregate([
      { $match: { paidBy: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const paid = paidAggregation.length > 0 ? paidAggregation[0].total : 0;

    // Calculate total user owes (from splits). We have to unwind splits first.
    const oweAggregation = await Expense.aggregate([
      { $unwind: '$splits' },
      { $match: { 'splits.user': require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: null, total: { $sum: '$splits.amount' } } }
    ]);
    const owe = oweAggregation.length > 0 ? oweAggregation[0].total : 0;

    // We can also calculate transactions sent/received if we want true balance
    // But since the original postgres query only looked at expenses and splits:
    res.json({ paid, owe, balance: paid - owe });
  } catch (err) { next(err); }
};
