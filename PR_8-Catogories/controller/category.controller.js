const Category = require('../model/catogory.model');
const fs = require('fs');
const path = require('path');

exports.viewCategoryPage = async (req, res) => {
    try {
        let categories = await Category.find();
        let user = req.user;
        return res.render("categories/viewCategories", { categories, user });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.addCategoryPage = async (req, res) => {
    try {
        let user = req.user;
        return res.render("categories/addCategories", { user });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.addCategory = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        let category = await Category.create({
            ...req.body,
            categoryImage: imagePath
        });
        console.log('Category Added Success');
        return res.redirect("/category/view-category");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.editCategoryPage = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        let user = req.user;
        return res.render("categories/editCategories", { category, user });
    } catch (error) {
        console.log(error);
        return res.redirect("/category/view-category");
    }
}

exports.editCategory = async (req, res) => {
    try {
        let updateData = { ...req.body };
        let oldCategory = await Category.findById(req.params.id);

        if (req.file) {
            // Delete old category image
            if (oldCategory.categoryImage) {
                let oldPath = path.join(__dirname, '..', oldCategory.categoryImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.categoryImage = `/uploads/${req.file.filename}`;
        }

        await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log('Category Updated Success');
        return res.redirect("/category/view-category");
    } catch (error) {
        console.log(error);
        return res.redirect("/category/view-category");
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        // Delete category image
        if (category.categoryImage) {
            let filePath = path.join(__dirname, '..', category.categoryImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Category.findByIdAndDelete(req.params.id);
        console.log('Category Deleted Success');
        return res.redirect("/category/view-category");
    } catch (error) {
        console.log(error);
        return res.redirect("/category/view-category");
    }
}
