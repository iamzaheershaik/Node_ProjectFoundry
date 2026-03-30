const express = require("express");
const router = express.Router();
const { registerSuperAdmin, loginSuperAdmin, getSuperAdmin, updateSuperAdmin } = require("../controllers/superAdmin.controller");
const superAdminAuth = require("../middleware/superAdminAuth");
const upload = require("../config/multerConfig");


router.post("/register", upload.single("profileImage"), registerSuperAdmin);
router.post("/login", loginSuperAdmin);


router.get("/profile", superAdminAuth, getSuperAdmin);
router.put("/update", superAdminAuth, upload.single("profileImage"), updateSuperAdmin);

module.exports = router;
