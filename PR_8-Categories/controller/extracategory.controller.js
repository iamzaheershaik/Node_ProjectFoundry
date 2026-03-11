const Extracategory = require("../model/extracategory.model");
const Subcategory = require("../model/subcategory.model");
const Category = require("../model/category.model");
const fs = require("fs");
const path = require("path");

exports.viewAllExtracategories = async (req, res) => {
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
    let extracategories = await Extracategory.find(query).populate({
      path: "subcategory",
      populate: { path: "category" },
    });
    let user = req.user;
    return res.render("extracategory/viewExtracategory", {
      extracategories,
      user,
      search,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.addExtracategoryPage = async (req, res) => {
  try {
    let user = req.user;
    let categories = await Category.find();
    let subcategories = await Subcategory.find().populate("category");
    return res.render("extracategory/addExtracategory", {
      user,
      categories,
      subcategories,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.addExtracategory = async (req, res) => {
  try {
    let extracategoryImagePath = "";

    if (req.file) {
      extracategoryImagePath = `/uploads/${req.file.filename}`;
    }

    let extracategory = await Extracategory.create({
      ...req.body,
      extracategoryImage: extracategoryImagePath,
    });
    console.log("Extracategory Added Success");
    return res.redirect("/extracategory/add");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.viewSingleExtracategory = async (req, res) => {
  try {
    let extracategory = await Extracategory.findById(req.params.id).populate({
      path: "subcategory",
      populate: { path: "category" },
    });
    let user = req.user;
    return res.render("extracategory/singleView", { extracategory, user });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.editExtracategoryPage = async (req, res) => {
  try {
    let extracategory = await Extracategory.findById(req.params.id).populate({
      path: "subcategory",
      populate: { path: "category" },
    });
    let user = req.user;
    let categories = await Category.find();
    let subcategories = await Subcategory.find().populate("category");
    return res.render("extracategory/editExtracategory", {
      extracategory,
      user,
      categories,
      subcategories,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.editExtracategory = async (req, res) => {
  try {
    let updateData = { ...req.body };
    let oldExtracategory = await Extracategory.findById(req.params.id);

    if (req.file) {
      // Delete old extracategory image
      if (oldExtracategory.extracategoryImage) {
        let oldPath = path.join(
          __dirname,
          "..",
          oldExtracategory.extracategoryImage,
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.extracategoryImage = `/uploads/${req.file.filename}`;
    }

    await Extracategory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    console.log("Extracategory Updated Success");
    return res.redirect("/extracategory/view");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.deleteExtracategory = async (req, res) => {
  try {
    let extracategory = await Extracategory.findById(req.params.id);

    // Delete extracategory image
    if (extracategory.extracategoryImage) {
      let filePath = path.join(
        __dirname,
        "..",
        extracategory.extracategoryImage,
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Extracategory.findByIdAndDelete(req.params.id);
    console.log("Extracategory Deleted Success");
    return res.redirect("/extracategory/view");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// API endpoint: Get extracategories by subcategory ID (for cascading dropdown)
exports.getBySubcategory = async (req, res) => {
  try {
    let extracategories = await Extracategory.find({
      subcategory: req.params.subcategoryId,
    });
    return res.json(extracategories);
  } catch (error) {
    console.log(error);
    return res.json([]);
  }
};
