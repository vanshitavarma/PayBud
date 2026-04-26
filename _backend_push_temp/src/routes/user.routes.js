const router = require('express').Router();
const { getProfile, updateProfile, updateAvatar } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/avatar', updateAvatar);

module.exports = router;
