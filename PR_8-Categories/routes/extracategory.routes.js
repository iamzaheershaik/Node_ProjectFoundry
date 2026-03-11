const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadImage = require("../middleware/uploadImage.multer");

// Controller
const extracategoryController = require("../controller/extracategory.controller");

// =============================================
// Extracategory Routes (all protected)
// =============================================
router.get(
  "/view",
  passport.checkAuthenticate,
  extracategoryController.viewAllExtracategories,
);
router.get(
  "/add",
  passport.checkAuthenticate,
  extracategoryController.addExtracategoryPage,
);
router.post(
  "/add",
  passport.checkAuthenticate,
  uploadImage.single("extracategoryImage"),
  extracategoryController.addExtracategory,
);
router.get(
  "/view/:id",
  passport.checkAuthenticate,
  extracategoryController.viewSingleExtracategory,
);
router.get(
  "/edit/:id",
  passport.checkAuthenticate,
  extracategoryController.editExtracategoryPage,
);
router.post(
  "/edit/:id",
  passport.checkAuthenticate,
  uploadImage.single("extracategoryImage"),
  extracategoryController.editExtracategory,
);
router.get(
  "/delete/:id",
  passport.checkAuthenticate,
  extracategoryController.deleteExtracategory,
);

// API: Get extracategories by subcategory (for cascading dropdown)
router.get(
  "/api/by-subcategory/:subcategoryId",
  passport.checkAuthenticate,
  extracategoryController.getBySubcategory,
);

module.exports = router;
