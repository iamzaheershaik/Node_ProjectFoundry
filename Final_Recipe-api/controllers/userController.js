const Recipe = require('../models/Recipe');

async function getMyRecipes(req, res) {
  try {
    const userId = req.user._id;
    const recipes = await Recipe.find({ createdBy: userId });

    res.status(200).json({ recipes: recipes });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getMyRecipes: getMyRecipes
};
