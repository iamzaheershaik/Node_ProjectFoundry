const Category = require("../model/category.model");
const Subcategory = require("../model/subcategory.model");
const Extracategory = require("../model/extracategory.model");
const fs = require("fs");
const path = require("path");

exports.viewAllCategories = async (req, res) => {
  try {
    let search = req.query.search || "";
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    let categories = await Category.find(query);
    let user = req.user;

    // Fetch subcategory counts for each category
    let categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        let subcategoryCount = await Subcategory.countDocuments({
          category: cat._id,
        });
        return { ...cat.toObject(), subcategoryCount };
      }),
    );

    return res.render("category/viewCategory", {
      categories: categoriesWithCount,
      user,
      search,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.addCategoryPage = async (req, res) => {
  try {
    let user = req.user;
    return res.render("category/addCategory", { user });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.addCategory = async (req, res) => {
  try {
    let categoryImagePath = "";

    if (req.file) {
      categoryImagePath = `/uploads/${req.file.filename}`;
    }

    let category = await Category.create({
      ...req.body,
      categoryImage: categoryImagePath,
    });
    console.log("Category Added Success");
    return res.redirect("/category/add");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.viewSingleCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    let user = req.user;

    // Fetch subcategories that belong to this category
    let subcategories = await Subcategory.find({ category: req.params.id });

    return res.render("category/singleView", { category, user, subcategories });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.editCategoryPage = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    let user = req.user;
    return res.render("category/editCategory", { category, user });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.editCategory = async (req, res) => {
  try {
    let updateData = { ...req.body };
    let oldCategory = await Category.findById(req.params.id);

    if (req.file) {
      // Delete old category image
      if (oldCategory.categoryImage) {
        let oldPath = path.join(__dirname, "..", oldCategory.categoryImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.categoryImage = `/uploads/${req.file.filename}`;
    }

    await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log("Category Updated Success");
    return res.redirect("/category/view");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    // Delete category image
    if (category.categoryImage) {
      let filePath = path.join(__dirname, "..", category.categoryImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Cascade delete: remove all subcategories belonging to this category (and their images)
    let subcategories = await Subcategory.find({ category: req.params.id });
    for (let sub of subcategories) {
      if (sub.subcategoryImage) {
        let subPath = path.join(__dirname, "..", sub.subcategoryImage);
        if (fs.existsSync(subPath)) fs.unlinkSync(subPath);
      }

      // Deep cascade: remove all extracategories belonging to this subcategory
      let extracategories = await Extracategory.find({ subcategory: sub._id });
      for (let extra of extracategories) {
        if (extra.extracategoryImage) {
          let extraPath = path.join(__dirname, "..", extra.extracategoryImage);
          if (fs.existsSync(extraPath)) fs.unlinkSync(extraPath);
        }
      }
      await Extracategory.deleteMany({ subcategory: sub._id });
    }
    await Subcategory.deleteMany({ category: req.params.id });

    await Category.findByIdAndDelete(req.params.id);
    console.log(
      "Category Deleted Success (with subcategories and extracategories)",
    );
    return res.redirect("/category/view");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
