

const express = require('express');
const router = express.Router();

const { getMyRecipes } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/users/me/recipes 
router.get('/me/recipes', protect, getMyRecipes);

module.exports = router;
