const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadImage = require("../middleware/uploadImage.multer");

// Controller
const categoryController = require("../controller/category.controller");

// =============================================
// Category Routes (all protected)
// =============================================
router.get("/view", passport.checkAuthenticate, categoryController.viewAllCategories);
router.get("/add", passport.checkAuthenticate, categoryController.addCategoryPage);
router.post("/add", passport.checkAuthenticate, uploadImage.single("categoryImage"), categoryController.addCategory);
router.get("/view/:id", passport.checkAuthenticate, categoryController.viewSingleCategory);
router.get("/edit/:id", passport.checkAuthenticate, categoryController.editCategoryPage);
router.post("/edit/:id", passport.checkAuthenticate, uploadImage.single("categoryImage"), categoryController.editCategory);
router.get("/delete/:id", passport.checkAuthenticate, categoryController.deleteCategory);

module.exports = router;
