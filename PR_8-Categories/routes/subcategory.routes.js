const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadImage = require("../middleware/uploadImage.multer");

// Controller
const subcategoryController = require("../controller/subcategory.controller");

// =============================================
// Subcategory Routes (all protected)
// =============================================
router.get("/view", passport.checkAuthenticate, subcategoryController.viewAllSubcategories);
router.get("/add", passport.checkAuthenticate, subcategoryController.addSubcategoryPage);
router.post("/add", passport.checkAuthenticate, uploadImage.single("subcategoryImage"), subcategoryController.addSubcategory);
router.get("/view/:id", passport.checkAuthenticate, subcategoryController.viewSingleSubcategory);
router.get("/edit/:id", passport.checkAuthenticate, subcategoryController.editSubcategoryPage);
router.post("/edit/:id", passport.checkAuthenticate, uploadImage.single("subcategoryImage"), subcategoryController.editSubcategory);
router.get("/delete/:id", passport.checkAuthenticate, subcategoryController.deleteSubcategory);

// API: Get subcategories by category (for cascading dropdown)
router.get("/api/by-category/:categoryId", passport.checkAuthenticate, subcategoryController.getByCategory);

module.exports = router;
