const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mysecret123';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'devrefreshsecret';

exports.generateToken = (user) =>
  jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

exports.generateRefreshToken = (user) =>
  jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

exports.verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET);

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, JWT_REFRESH_SECRET);
