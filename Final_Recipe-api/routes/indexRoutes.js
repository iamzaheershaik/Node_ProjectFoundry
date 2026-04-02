const express = require("express");
const Router = express.Router();

Router.use('/auth', require('./authRoutes'));
Router.use('/recipes', require('./recipeRoutes'));
Router.use('/comments', require('./commentRoutes'));
Router.use('/users', require('./userRoutes'));


module.exports = Router