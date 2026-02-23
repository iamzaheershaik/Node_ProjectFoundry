const express = require("express");
const router = express.Router();
const uploadBlogImage = require("../middleware/uploadBlogImage.multer");

// Controller
const blogController = require("../controller/blog.controller");

// =============================================
// Blog Routes
// =============================================
router.get("/view", blogController.viewAllBlogs);
router.get("/add", blogController.addBlogPage);
router.post("/add", uploadBlogImage.fields([
    { name: "authorImage", maxCount: 1 },
    { name: "blogImage", maxCount: 1 }
]), blogController.addBlog);
router.get("/view/:id", blogController.viewSingleBlog);
router.get("/edit/:id", blogController.editBlogPage);
router.post("/edit/:id", uploadBlogImage.fields([
    { name: "authorImage", maxCount: 1 },
    { name: "blogImage", maxCount: 1 }
]), blogController.editBlog);
router.get("/delete/:id", blogController.deleteBlog);

module.exports = router;
