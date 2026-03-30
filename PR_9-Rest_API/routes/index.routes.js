const express = require("express");
const router = express.Router();

const superAdminRoutes = require("./superAdmin.routes");
const adminRoutes = require("./admin.routes");
const managerRoutes = require("./manager.routes");
const employeeRoutes = require("./employee.routes");

router.use("/superadmin", superAdminRoutes);
router.use("/admin", adminRoutes);
router.use("/manager", managerRoutes);
router.use("/employee", employeeRoutes);

module.exports = router;