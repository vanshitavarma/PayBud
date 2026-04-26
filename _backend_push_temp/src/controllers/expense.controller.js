const Expense = require('../models/expense.model');
const Group = require('../models/group.model');

exports.getExpenses = async (req, res, next) => {
  try {
    const { groupId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const query = {};
    if (groupId) {
      query.group = groupId;
    } else {
      // Find expenses in groups where the user is a member
      const groups = await Group.find({ members: req.user.userId }).select('_id');
      query.group = { $in: groups.map(g => g._id) };
    }

    const expenses = await Expense.find(query)
      .populate('paidBy', 'name')
      .sort('-createdAt')
      .skip(offset)
      .limit(parseInt(limit));

    res.json({ expenses });
  } catch (err) { next(err); }
};

exports.createExpense = async (req, res, next) => {
  try {
    const { groupId, title, amount, category, splitType, splits, notes, date } = req.body;
    
    // Check wallet balance
    const User = require('../models/user.model');
    const payer = await User.findById(req.user.userId);
    if (!payer) return res.status(404).json({ error: 'User not found' });
    if (payer.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Convert splits from { userId, amount } to { user, amount } to match Mongoose schema
    const formattedSplits = splits ? splits.map(s => ({ user: s.userId, amount: s.amount })) : [];

    // Deduct amount from wallet
    payer.walletBalance -= amount;
    await payer.save();

    const expense = await Expense.create({
      group: groupId,
      title,
      amount,
      category,
      splitType,
      paidBy: req.user.userId,
      notes,
      expenseDate: date || new Date(),
      splits: formattedSplits
    });

    res.status(201).json({ expense });
  } catch (err) { next(err); }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { title, amount, category, notes } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, paidBy: req.user.userId },
      { title, amount, category, notes },
      { new: true }
    );
    if (!expense) return res.status(403).json({ error: 'Forbidden' });
    res.json({ expense });
  } catch (err) { next(err); }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, paidBy: req.user.userId });
    if (!expense) return res.status(403).json({ error: 'Forbidden' });
    res.json({ message: 'Expense deleted' });
  } catch (err) { next(err); }
};
