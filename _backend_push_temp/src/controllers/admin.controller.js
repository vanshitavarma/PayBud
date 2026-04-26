const User = require('../models/user.model');

// Get all users and their balances
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('name email upiId walletBalance role createdAt');
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// Add bank balance to user
exports.addBalance = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.walletBalance += parseFloat(amount);
    await user.save();

    res.json({ message: 'Balance added successfully', walletBalance: user.walletBalance });
  } catch (err) {
    next(err);
  }
};
