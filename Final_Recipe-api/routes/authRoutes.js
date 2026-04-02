const express = require('express');
const router  = express.Router();

const { register, login, logout } = require('../controllers/authController');
const { protect }                 = require('../middleware/authMiddleware');

// POST /api/auth/register  →  Create a new account
router.post('/register', register);

// POST /api/auth/login  →  Login and get a token
router.post('/login', login);

// POST /api/auth/logout  →  Logout (protected so token is verified)
router.post('/logout', protect, logout);

module.exports = router;
