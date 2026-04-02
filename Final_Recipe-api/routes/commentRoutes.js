
const express = require('express');
const router = express.Router();

const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/comments/:recipeId  
// GET  /api/comments/:recipeId  
router.route('/:recipeId')
  .post(protect, addComment)
  .get(getComments);

// DELETE /api/comments/:id  
router.delete('/:id', protect, deleteComment);

module.exports = router;
