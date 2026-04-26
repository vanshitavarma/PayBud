const express = require('express');
const { authenticate: auth } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const User = require('../models/user.model');
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.use(auth, requireAdmin);

router.get('/users', adminController.getAllUsers);
router.post('/add-balance', adminController.addBalance);

module.exports = router;
