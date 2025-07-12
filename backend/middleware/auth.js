const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Optional authentication (for public routes that can show user-specific data)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without user
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
}; 