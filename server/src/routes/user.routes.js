const router = require('express').Router();
const { getProfile, updateProfile, updateAvatar } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/profile', getProfile);
router.get('/search/:upiId', require('../controllers/user.controller').searchByUpi);
router.post('/wallet/add', require('../controllers/user.controller').addMoney);
router.put('/profile', updateProfile);
router.put('/avatar', updateAvatar);

module.exports = router;
