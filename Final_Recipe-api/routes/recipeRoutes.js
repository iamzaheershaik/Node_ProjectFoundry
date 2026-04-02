const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

// GET  /api/recipes         
// POST /api/recipes          
router.route('/')
  .get(getAllRecipes)
  .post(protect, createRecipe);

// GET    /api/recipes/:id   
// PUT    /api/recipes/:id    
// DELETE /api/recipes/:id   

router.route('/:id')
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);


module.exports = router;