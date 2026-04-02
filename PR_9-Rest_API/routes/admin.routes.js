const express = require("express");
const router = express.Router();
const { createAdmin, loginAdmin, getAdmin, getMyProfile, viewAdmins, singleviewAdmin, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");
const adminAuth = require("../middleware/adminAuth");
const superAdminAuth = require("../middleware/superAdminAuth");
const upload = require("../config/multerConfig");

// public routes
router.post("/login", loginAdmin);

// superadmin protected routes (superadmin creates and deletes admin)
router.post("/create", superAdminAuth, upload.single("profileImage"), createAdmin);
router.delete("/delete/:id", superAdminAuth, deleteAdmin);

// admin protected routes (admin can only view and update own)
router.get("/profile", adminAuth, getAdmin);
router.get("/myprofile", adminAuth, getMyProfile);
router.get("/viewAdmins", adminAuth, viewAdmins);
router.get("/singleviewAdmin/:id", adminAuth, singleviewAdmin);
router.put("/update", adminAuth, upload.single("profileImage"), updateAdmin);

module.exports = router;
