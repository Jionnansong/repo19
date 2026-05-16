const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const SECRET_KEY = process.env.JWT_SECRET || 'member_management_secret_2024';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware, SECRET_KEY };
