const router = require('express').Router();
const ctrl = require('../controllers/group.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', ctrl.getGroups);
router.post('/', ctrl.createGroup);
router.get('/:id', ctrl.getGroup);
router.put('/:id', ctrl.updateGroup);
router.delete('/:id', ctrl.deleteGroup);
router.get('/:id/balances', ctrl.getBalances);
router.post('/:id/invite', ctrl.inviteMember);

module.exports = router;
