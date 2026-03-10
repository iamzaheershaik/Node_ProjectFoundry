const Subcategory = require("../model/subcategory.model");
const Category = require("../model/category.model");
const fs = require('fs');
const path = require('path');

exports.viewAllSubcategories = async (req, res) => {
    try {
        let search = req.query.search || "";
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            };
        }
        let subcategories = await Subcategory.find(query).populate("category");
        let user = req.user;
        return res.render("subcategory/viewSubcategory", { subcategories, user, search });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addSubcategoryPage = async (req, res) => {
    try {
        let user = req.user;
        let categories = await Category.find();
        return res.render("subcategory/addSubcategory", { user, categories });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addSubcategory = async (req, res) => {
    try {
        let subcategoryImagePath = "";

        if (req.file) {
            subcategoryImagePath = `/uploads/${req.file.filename}`;
        }

        let subcategory = await Subcategory.create({
            ...req.body,
            subcategoryImage: subcategoryImagePath
        });
        console.log('Subcategory Added Success');
        return res.redirect("/subcategory/add");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.viewSingleSubcategory = async (req, res) => {
    try {
        let subcategory = await Subcategory.findById(req.params.id).populate("category");
        let user = req.user;
        return res.render("subcategory/singleView", { subcategory, user });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editSubcategoryPage = async (req, res) => {
    try {
        let subcategory = await Subcategory.findById(req.params.id).populate("category");
        let user = req.user;
        let categories = await Category.find();
        return res.render("subcategory/editSubcategory", { subcategory, user, categories });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editSubcategory = async (req, res) => {
    try {
        let updateData = { ...req.body };
        let oldSubcategory = await Subcategory.findById(req.params.id);

        if (req.file) {
            // Delete old subcategory image
            if (oldSubcategory.subcategoryImage) {
                let oldPath = path.join(__dirname, '..', oldSubcategory.subcategoryImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.subcategoryImage = `/uploads/${req.file.filename}`;
        }

        await Subcategory.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log('Subcategory Updated Success');
        return res.redirect("/subcategory/view");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.deleteSubcategory = async (req, res) => {
    try {
        let subcategory = await Subcategory.findById(req.params.id);

        // Delete subcategory image
        if (subcategory.subcategoryImage) {
            let filePath = path.join(__dirname, '..', subcategory.subcategoryImage);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Subcategory.findByIdAndDelete(req.params.id);
        console.log('Subcategory Deleted Success');
        return res.redirect("/subcategory/view");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

// API endpoint: Get subcategories by category ID (for cascading dropdown)
exports.getByCategory = async (req, res) => {
    try {
        let subcategories = await Subcategory.find({ category: req.params.categoryId });
        return res.json(subcategories);
    } catch (error) {
        console.log(error);
        return res.json([]);
    }
}
