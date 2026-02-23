const express = require("express");
const router = express.Router();
const uploadImage = require("../middleware/uploadImage.multer");


const adminController = require("../controller/admin.controller");
router.get("/view-admin", adminController.viewAllAdmins);
router.get("/add-admin", adminController.addAdminPage);
router.post("/add-admin", uploadImage.single("profileImage"), adminController.addAdmin);
router.get("/view-admin/:id", adminController.viewSingleAdmin);
router.get("/edit-admin/:id", adminController.editAdminPage);
router.post("/edit-admin/:id", uploadImage.single("profileImage"), adminController.editAdmin);
router.get("/delete-admin/:id", adminController.deleteAdmin);

module.exports = router;
