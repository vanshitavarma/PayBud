const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/transactions', ctrl.getTransactions);
router.post('/settle', ctrl.settleDebt);
router.get('/balance', ctrl.getUserBalance);

module.exports = router;
