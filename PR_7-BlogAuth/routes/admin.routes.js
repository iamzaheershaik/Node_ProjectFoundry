const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadImage = require("../middleware/uploadImage.multer");

const adminController = require("../controller/admin.controller");

// All admin routes are protected
router.get("/view-admin", passport.checkAuthenticate, adminController.viewAllAdmins);
router.get("/add-admin", passport.checkAuthenticate, adminController.addAdminPage);
router.post("/add-admin", passport.checkAuthenticate, uploadImage.single("profileImage"), adminController.addAdmin);
router.get("/view-admin/:id", passport.checkAuthenticate, adminController.viewSingleAdmin);
router.get("/edit-admin/:id", passport.checkAuthenticate, adminController.editAdminPage);
router.post("/edit-admin/:id", passport.checkAuthenticate, uploadImage.single("profileImage"), adminController.editAdmin);
router.get("/delete-admin/:id", passport.checkAuthenticate, adminController.deleteAdmin);

module.exports = router;
