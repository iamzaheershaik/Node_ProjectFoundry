const express = require("express");
const router = express.Router();

// Import separate route files
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const blogRoutes = require("./blog.routes");
const categoryRoutes = require("./category.routes");
const subcategoryRoutes = require("./subcategory.routes");
const extracategoryRoutes = require("./extracategory.routes");
const productRoutes = require("./product.routes");

// Mount routes
router.use("/", authRoutes);
router.use("/admin", adminRoutes);
router.use("/blog", blogRoutes);
router.use("/category", categoryRoutes);
router.use("/subcategory", subcategoryRoutes);
router.use("/extracategory", extracategoryRoutes);
router.use("/product", productRoutes);

module.exports = router;
