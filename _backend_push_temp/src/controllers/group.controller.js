const Group = require('../models/group.model');
const Expense = require('../models/expense.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user.userId }).sort('-createdAt');
    res.json({ groups: groups.map(g => ({ ...g.toObject(), member_count: g.members.length })) });
  } catch (err) { next(err); }
};

exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'id name email avatarUrl');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json({ group });
  } catch (err) { next(err); }
};

exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, currency } = req.body;
    const group = await Group.create({
      name,
      description,
      currency: currency || 'INR',
      createdBy: req.user.userId,
      members: [req.user.userId] // adding creator as member
    });
    res.status(201).json({ group });
  } catch (err) { next(err); }
};

exports.updateGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      { name, description },
      { new: true }
    );
    if (!group) return res.status(403).json({ error: 'Forbidden' });
    res.json({ group });
  } catch (err) { next(err); }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    await Group.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
    res.json({ message: 'Group deleted' });
  } catch (err) { next(err); }
};

exports.getBalances = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ group: req.params.id });
    const group = await Group.findById(req.params.id).populate('members', 'id name');

    if (!group) return res.status(404).json({ error: 'Group not found' });

    let balancesMap = {};
    group.members.forEach(m => { balancesMap[m._id.toString()] = { id: m._id, name: m.name, balance: 0 }; });

    expenses.forEach(e => {
        const paidById = e.paidBy.toString();
        if (balancesMap[paidById]) balancesMap[paidById].balance += e.amount;

        e.splits.forEach(s => {
            const splitUserId = s.user.toString();
            if (balancesMap[splitUserId]) balancesMap[splitUserId].balance -= s.amount;
        });
    });

    res.json({ balances: Object.values(balancesMap) });
  } catch (err) { next(err); }
};

exports.inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    
    // Only allow creator or members to invite
    if (!group.members.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to invite to this group' });
    }

    const userToInvite = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToInvite) {
      return res.status(404).json({ error: 'User with this email not found' });
    }

    if (group.members.includes(userToInvite._id)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    group.members.push(userToInvite._id);
    await group.save();

    res.json({ message: 'User added to group', group });
  } catch (err) { next(err); }
};
