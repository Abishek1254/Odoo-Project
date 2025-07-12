import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user from token
export const getUserFromToken = async (token) => {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch (error) {
    return null;
  }
};

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Middleware to check admin role
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
}; 