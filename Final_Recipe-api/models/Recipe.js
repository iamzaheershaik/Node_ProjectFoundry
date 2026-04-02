const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',    
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
