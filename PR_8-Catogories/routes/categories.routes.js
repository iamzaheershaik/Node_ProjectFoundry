const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadImage = require("../middleware/uploadImage.multer");

// Controller
const categoryController = require('../controller/category.controller');

// =============================================
// Category Routes (all protected)
// =============================================
router.get("/view-category", passport.checkAuthenticate, categoryController.viewCategoryPage);
router.get("/add-category", passport.checkAuthenticate, categoryController.addCategoryPage);
router.post("/add-category", passport.checkAuthenticate, uploadImage.single('categoryImage'), categoryController.addCategory);
router.get("/edit-category/:id", passport.checkAuthenticate, categoryController.editCategoryPage);
router.post("/edit-category/:id", passport.checkAuthenticate, uploadImage.single('categoryImage'), categoryController.editCategory);
router.get("/delete-category/:id", passport.checkAuthenticate, categoryController.deleteCategory);

module.exports = router;