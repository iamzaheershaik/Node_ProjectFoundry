const Recipe = require('../models/Recipe');

async function getAllRecipes(req, res) {
  try {
    let page = req.query.page;
    if (page == null) {
      page = 1;
    } else {
      page = parseInt(page);
    }

    let limit = req.query.limit;
    if (limit == null) {
      limit = 10;
    } else {
      limit = parseInt(limit);
    }

    let skipNum = (page - 1) * limit;

    const recipes = await Recipe.find().populate('createdBy', 'username email').skip(skipNum).limit(limit);
    
    const total = await Recipe.countDocuments();
    let pages = Math.ceil(total / limit);

    res.status(200).json({
      recipes: recipes,
      pagination: {
        total: total,
        page: page,
        pages: pages
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getRecipeById(req, res) {
  try {
    let id = req.params.id;
    const recipe = await Recipe.findById(id).populate('createdBy', 'username email');

    if (recipe == null) {
      res.status(404).json({ message: 'Recipe not found.' });
      return;
    }

    res.status(200).json({ recipe: recipe });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createRecipe(req, res) {
  try {
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const userId = req.user._id;

    const newRecipe = new Recipe({
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      createdBy: userId
    });

    await newRecipe.save();

    res.status(201).json({ message: 'Recipe created!', recipe: newRecipe });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateRecipe(req, res) {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);

    if (recipe == null) {
      res.status(404).json({ message: 'Recipe not found.' });
      return;
    }

    let canUpdate = false;
    
    if (recipe.createdBy.toString() == req.user._id.toString()) {
      canUpdate = true;
    }
    
    if (req.user.role == 'admin') {
      canUpdate = true;
    }

    if (canUpdate == false) {
      res.status(403).json({ message: 'Not allowed to update this recipe.' });
      return;
    }

    if (req.body.title != null) {
      recipe.title = req.body.title;
    }
    if (req.body.ingredients != null) {
      recipe.ingredients = req.body.ingredients;
    }
    if (req.body.instructions != null) {
      recipe.instructions = req.body.instructions;
    }

    await recipe.save();

    res.status(200).json({ message: 'Recipe updated!', recipe: recipe });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteRecipe(req, res) {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);

    if (recipe == null) {
      res.status(404).json({ message: 'Recipe not found.' });
      return;
    }

    let canDelete = false;

    if (recipe.createdBy.toString() == req.user._id.toString()) {
      canDelete = true;
    }

    if (req.user.role == 'admin') {
      canDelete = true;
    }

    if (canDelete == false) {
      res.status(403).json({ message: 'Not allowed to delete this recipe.' });
      return;
    }

    await Recipe.deleteOne({ _id: id });

    res.status(200).json({ message: 'Recipe deleted successfully.' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllRecipes: getAllRecipes,
  getRecipeById: getRecipeById,
  createRecipe: createRecipe,
  updateRecipe: updateRecipe,
  deleteRecipe: deleteRecipe
};
