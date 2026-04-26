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
