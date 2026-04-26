const User = require('../models/user.model');
const Bank = require('../models/bank.model');

// Get all users, their balances, and Central Bank balance
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('name email upiId walletBalance role createdAt');
    
    let bank = await Bank.findOne();
    if (!bank) {
        bank = await Bank.create({ totalBalance: 1000000 }); // Starting pool for the whole app
    }
    
    res.json({ users, bankBalance: bank.totalBalance });
  } catch (err) {
    next(err);
  }
};

// Add bank balance to user (Deduct from central bank)
exports.addBalance = async (req, res, next) => {
  try {
    const { userId, amount: rawAmount } = req.body;
    const amount = parseFloat(rawAmount);
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let bank = await Bank.findOne();
    if (!bank) {
        bank = await Bank.create({ totalBalance: 1000000 });
    }

    if (bank.totalBalance < amount) {
        return res.status(400).json({ error: 'Insufficient funds in the Central Bank pool' });
    }

    // Update user
    user.walletBalance += amount;
    await user.save();

    // Update bank
    bank.totalBalance -= amount;
    bank.history.push({
        userId: user._id,
        amount: amount,
        type: 'manual_deposit'
    });
    await bank.save();

    res.json({ message: 'Balance transferred from bank successfully', walletBalance: user.walletBalance, bankBalance: bank.totalBalance });
  } catch (err) {
    next(err);
  }
};
