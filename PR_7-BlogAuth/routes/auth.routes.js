const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");

const authController = require("../controller/auth.controller");
const uploadImage = require("../middleware/uploadImage.multer");

// Public routes (no authentication required)
router.get("/", authController.loginPage);
router.get("/login", authController.loginPage);
router.get("/register", authController.registerPage);
router.post("/register", uploadImage.single('profileImage'), authController.register);
router.get("/forgot-password", authController.forgotPasswordPage);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/login", passport.authenticate('local', { failureRedirect: "/" }), authController.login);

// Protected routes (authentication required)
router.get("/logout", passport.checkAuthenticate, authController.LogOutAdmin);
router.get("/dashboard", passport.checkAuthenticate, authController.dashboardPage);
router.get("/my-profile", passport.checkAuthenticate, authController.myProfile);
router.get("/change-password", passport.checkAuthenticate, authController.changePasswordPage);
router.post("/change-password", passport.checkAuthenticate, authController.changePassword);

module.exports = router;
