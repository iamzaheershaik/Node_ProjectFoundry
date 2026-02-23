const express = require("express");
const router = express.Router();

// Import separate route files
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const blogRoutes = require("./blog.routes");

// Mount routes
router.use("/", authRoutes);
router.use("/admin", adminRoutes);
router.use("/blog", blogRoutes);

module.exports = router;
