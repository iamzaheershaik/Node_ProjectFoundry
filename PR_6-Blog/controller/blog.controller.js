const Blog = require("../model/model.schema");
const fs = require('fs');
const path = require('path');

exports.viewAllBlogs = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined)
        {
            let search = req.query.search || "";
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { authorname: { $regex: search, $options: "i" } },
                        { category: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                };
            }
            let blogs = await Blog.find(query);
            let user = req.cookies.admin;
            return res.render("blog/viewBlog", { blogs, user, search });
        } else {
            return res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addBlogPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let user = req.cookies.admin;
            return res.render("blog/addBlog", {user});
        }
        else
            return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addBlog = async (req, res) => {
    try {
        let authorImagePath = "";
        let blogImagePath = "";

        if (req.files) {
            if (req.files.authorImage && req.files.authorImage[0]) {
                authorImagePath = `/uploads/${req.files.authorImage[0].filename}`;
            }
            if (req.files.blogImage && req.files.blogImage[0]) {
                blogImagePath = `/uploads/${req.files.blogImage[0].filename}`;
            }
        }

        let blog = await Blog.create({
            ...req.body,
            authorImage: authorImagePath,
            blogImage: blogImagePath
        });
        console.log('Blog Added Success');
        return res.redirect("/blog/add");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.viewSingleBlog = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let blog = await Blog.findById(req.params.id);
            let user = req.cookies.admin;
            return res.render("blog/singleView", { blog, user });
        }
        else
            return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editBlogPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.admin && req.cookies.admin._id != undefined){
            let blog = await Blog.findById(req.params.id);
            let user = req.cookies.admin;
            return res.render("blog/editBlog", { blog, user });
        }
        else
            return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editBlog = async (req, res) => {
    try {
        let updateData = { ...req.body };
        let oldBlog = await Blog.findById(req.params.id);

        if (req.files) {
            if (req.files.authorImage && req.files.authorImage[0]) {
                // Delete old author image
                if (oldBlog.authorImage) {
                    let oldPath = path.join(__dirname, '..', oldBlog.authorImage);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                updateData.authorImage = `/uploads/${req.files.authorImage[0].filename}`;
            }
            if (req.files.blogImage && req.files.blogImage[0]) {
                // Delete old blog image
                if (oldBlog.blogImage) {
                    let oldPath = path.join(__dirname, '..', oldBlog.blogImage);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                updateData.blogImage = `/uploads/${req.files.blogImage[0].filename}`;
            }
        }

        await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log('Blog Updated Success');
        return res.redirect("/blog/view");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        // Delete author image
        if (blog.authorImage) {
            let filePath = path.join(__dirname, '..', blog.authorImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        // Delete blog image
        if (blog.blogImage) {
            let filePath = path.join(__dirname, '..', blog.blogImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Blog.findByIdAndDelete(req.params.id);
        console.log('Blog Deleted Success');
        return res.redirect("/blog/view");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}
