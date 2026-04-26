const User = require('../models/user.model');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    await User.findByIdAndUpdate(req.user.userId, { avatarUrl });
    res.json({ message: 'Avatar updated' });
  } catch (err) { next(err); }
};

exports.searchByUpi = async (req, res, next) => {
  try {
    const { upiId } = req.params;
    // Search by UPI ID (exact) or Name (case-insensitive partial match)
    const user = await User.findOne({ 
      $or: [
        { upiId: upiId.toLowerCase() },
        { name: { $regex: upiId, $options: 'i' } }
      ]
    }).select('name email upiId avatarUrl');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
};

exports.addMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(req.user.userId);
    user.walletBalance = (user.walletBalance || 0) + amountNum;
    await user.save();

    res.json({ 
      message: `₹${amountNum} added successfully`, 
      walletBalance: user.walletBalance 
    });
  } catch (err) { next(err); }
};
