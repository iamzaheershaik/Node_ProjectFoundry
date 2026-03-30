const express = require("express");
const router = express.Router();
const { createManager, loginManager, viewManagers, singleviewManager, getManager, updateManager, deleteManager } = require("../controllers/manager.controller");
const adminAuth = require("../middleware/adminAuth");
const managerAuth = require("../middleware/managerAuth");
const upload = require("../config/multerConfig");

// public routes
router.post("/login", loginManager);

// admin protected routes (admin creates/deletes manager)
router.post("/create", adminAuth, upload.single("profileImage"), createManager);
router.get("/viewManagers", adminAuth, viewManagers);
router.get("/singleviewManager/:id", adminAuth, singleviewManager);
router.delete("/delete/:id", adminAuth, deleteManager);

// manager protected routes
router.get("/profile", managerAuth, getManager);
router.put("/update", managerAuth, upload.single("profileImage"), updateManager);

module.exports = router;
