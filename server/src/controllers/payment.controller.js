const Transaction = require('../models/transaction.model');
const Expense = require('../models/expense.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

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
  const { payeeId, amount, groupId, method, transactionId } = req.body;
  const payerId = req.user.userId;
  
  try {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check if confirming existing pending request
    let existingTransaction;
    if (transactionId) {
      existingTransaction = await Transaction.findById(transactionId);
      if (!existingTransaction) return res.status(404).json({ error: 'Transaction request not found' });
      if (existingTransaction.payer.toString() !== payerId) return res.status(403).json({ error: 'Not authorized' });
    }

    if (payeeId === payerId) {
      return res.status(400).json({ error: 'You cannot pay yourself' });
    }

    // Attempt to cast IDs to ensure they are valid ObjectIds
    try {
        mongoose.Types.ObjectId.createFromHexString(payeeId);
    } catch {
        return res.status(400).json({ error: 'Invalid Payee ID format' });
    }

    if (method === 'wallet' || !method) {
      const payer = await User.findById(payerId);
      const payee = await User.findById(payeeId);

      if (!payer) return res.status(404).json({ error: 'Sender account not found' });
      if (!payee) return res.status(404).json({ error: 'Recipient account not found' });
      
      const balance = payer.walletBalance || 0;
      if (balance < amountNum) {
        return res.status(400).json({ error: `Insufficient funds. Balance: ₹${balance}` });
      }

      payer.walletBalance = balance - amountNum;
      payee.walletBalance = (payee.walletBalance || 0) + amountNum;
      
      await payer.save();
      await payee.save();
    }

    let result;
    if (existingTransaction) {
      existingTransaction.status = 'completed';
      existingTransaction.paymentMethod = method || 'manual';
      result = await existingTransaction.save();
    } else {
      const transactionData = {
        payer: payerId,
        payee: payeeId,
        amount: amountNum,
        paymentMethod: method || 'manual',
        status: 'completed',
        group: groupId
      };
      
      if (groupId && mongoose.isObjectIdOrHexString(groupId)) {
        transactionData.group = groupId;
      }

      result = await Transaction.create(transactionData);
    }
    
    res.status(201).json({ transaction: result });
  } catch (err) { 
    console.error('[Payment Error Details]:', { payerId, payeeId, amount, method, error: err.message, stack: err.stack });
    res.status(500).json({ 
        error: 'System Error during payment. Please try again later.',
        details: err.message,
        debug: { payerId, payeeId }
    }); 
  }
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

    // Calculate total user owes (from splits)
    const oweAggregation = await Expense.aggregate([
      { $unwind: '$splits' },
      { $match: { 'splits.user': mongoose.Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: null, total: { $sum: '$splits.amount' } } }
    ]);
    const owe = oweAggregation.length > 0 ? oweAggregation[0].total : 0;

    // Calculate settlements sent/received
    const sentAggregation = await Transaction.aggregate([
      { $match: { payer: mongoose.Types.ObjectId.createFromHexString(userId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const sent = sentAggregation.length > 0 ? sentAggregation[0].total : 0;

    const receivedAggregation = await Transaction.aggregate([
      { $match: { payee: mongoose.Types.ObjectId.createFromHexString(userId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const received = receivedAggregation.length > 0 ? receivedAggregation[0].total : 0;

    // The user 'paid' amount decreases when they are repaid (receive money)
    // The user 'owe' amount decreases when they pay off debts (send money)
    const finalPaid = Math.max(0, paid - received);
    const finalOwe = Math.max(0, owe - sent);

    res.json({ 
        paid: finalPaid, 
        owe: finalOwe, 
        balance: finalPaid - finalOwe 
    });
  } catch (err) { next(err); }
};
