const express = require("express");
const router = express.Router();
const { registerSuperAdmin, loginSuperAdmin, getSuperAdmin } = require("../controllers/superAdmin.controller");
const superAdminAuth = require("../middleware/superAdminAuth");
const upload = require("../config/multerConfig");


router.post("/register", upload.single("profileImage"), registerSuperAdmin);
router.post("/login", loginSuperAdmin);


router.get("/profile", superAdminAuth, getSuperAdmin);

module.exports = router;
