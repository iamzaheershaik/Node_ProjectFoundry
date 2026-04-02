// ──────────────────────────────────────────────
// middleware/authMiddleware.js
// Verifies the JWT token on protected routes
// ──────────────────────────────────────────────

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// protect → use this on any route that needs login
const protect = async (req, res, next) => {
  try {
    // Step 1: Get the token from the Authorization header
    // Format:  Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token. Please login.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    // Step 2: Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contains: { id, role, iat, exp }

    // Step 3: Find the user in DB and attach to request
    const user = await User.findById(decoded.id).select('-password');
    // .select('-password') → exclude password from the result

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user; // Now every route can access req.user
    next();          // Move on to the actual route handler

  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
