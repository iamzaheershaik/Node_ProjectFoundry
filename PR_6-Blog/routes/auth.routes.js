const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controller/auth.controller");

// Middleware
const uploadImage = require("../middleware/uploadImage.multer");

// =============================================
// Auth Routes
// =============================================
router.get("/", authController.loginPage);
router.get("/login", authController.loginPage);
router.get("/register", authController.registerPage);
router.post("/register", uploadImage.single('profileImage'), authController.register);
router.get("/forgot-password", authController.forgotPasswordPage);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/login", authController.login);
router.get("/logout", authController.LogOutAdmin);
router.get("/dashboard", authController.dashboardPage);
router.get("/my-profile", authController.myProfile);
router.get("/change-password", authController.changePasswordPage);
router.post("/change-password", authController.changePassword);

module.exports = router;
