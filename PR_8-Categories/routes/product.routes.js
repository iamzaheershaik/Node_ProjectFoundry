const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadImage = require("../middleware/uploadImage.multer");

// Controller
const productController = require("../controller/product.controller");

// =============================================
// Product Routes (all protected)
// =============================================
router.get(
  "/view",
  passport.checkAuthenticate,
  productController.viewAllProducts,
);
router.get(
  "/add",
  passport.checkAuthenticate,
  productController.addProductPage,
);
router.post(
  "/add",
  passport.checkAuthenticate,
  uploadImage.single("productImage"),
  productController.addProduct,
);
router.get(
  "/view/:id",
  passport.checkAuthenticate,
  productController.viewSingleProduct,
);
router.get(
  "/edit/:id",
  passport.checkAuthenticate,
  productController.editProductPage,
);
router.post(
  "/edit/:id",
  passport.checkAuthenticate,
  uploadImage.single("productImage"),
  productController.editProduct,
);
router.get(
  "/delete/:id",
  passport.checkAuthenticate,
  productController.deleteProduct,
);

module.exports = router;
