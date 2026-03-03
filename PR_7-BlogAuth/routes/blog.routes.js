const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport-local-strategy");
const uploadBlogImage = require("../middleware/uploadBlogImage.multer");

// Controller
const blogController = require("../controller/blog.controller");

// =============================================
// Blog Routes (all protected)
// =============================================
router.get("/view", passport.checkAuthenticate, blogController.viewAllBlogs);
router.get("/add", passport.checkAuthenticate, blogController.addBlogPage);
router.post("/add", passport.checkAuthenticate, uploadBlogImage.fields([
    { name: "authorImage", maxCount: 1 },
    { name: "blogImage", maxCount: 1 }
]), blogController.addBlog);
router.get("/view/:id", passport.checkAuthenticate, blogController.viewSingleBlog);
router.get("/edit/:id", passport.checkAuthenticate, blogController.editBlogPage);
router.post("/edit/:id", passport.checkAuthenticate, uploadBlogImage.fields([
    { name: "authorImage", maxCount: 1 },
    { name: "blogImage", maxCount: 1 }
]), blogController.editBlog);
router.get("/delete/:id", passport.checkAuthenticate, blogController.deleteBlog);

module.exports = router;
