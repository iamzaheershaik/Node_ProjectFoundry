const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller")

// /api/auth/register
router.post("/register", authController.userRegisterController);

// /api/auth/register
router.post("/login");


module.exports = router;
