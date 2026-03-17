const Product = require("../model/product.model");
const Category = require("../model/category.model");
const Subcategory = require("../model/subcategory.model");
const Extracategory = require("../model/extracategory.model");
const fs = require("fs");
const path = require("path");

exports.viewAllProducts = async (req, res) => {
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
    let products = await Product.find(query)
      .populate("category")
      .populate({
        path: "subcategory",
        populate: { path: "category" },
      })
      .populate({
        path: "extracategory",
        populate: {
          path: "subcategory",
          populate: { path: "category" },
        },
      });
    let user = req.user;
    return res.render("product/viewProduct", { products, user, search });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.addProductPage = async (req, res) => {
  try {
    let user = req.user;
    let categories = await Category.find();
    return res.render("product/addProduct", { user, categories });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.addProduct = async (req, res) => {
  try {
    let productImagePath = "";

    if (req.file) {
      productImagePath = `/uploads/${req.file.filename}`;
    }

    let product = await Product.create({
      ...req.body,
      productImage: productImagePath,
    });
    console.log("Product Added Success");
    return res.redirect("/product/add");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.viewSingleProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subcategory")
      .populate("extracategory");
    let user = req.user;
    return res.render("product/singleView", { product, user });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.editProductPage = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subcategory")
      .populate("extracategory");
    let user = req.user;
    let categories = await Category.find();
    let subcategories = await Subcategory.find().populate("category");
    let extracategories = await Extracategory.find().populate("subcategory");
    return res.render("product/editProduct", {
      product,
      user,
      categories,
      subcategories,
      extracategories,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.editProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };
    let oldProduct = await Product.findById(req.params.id);

    if (req.file) {
      // Delete old product image
      if (oldProduct.productImage) {
        let oldPath = path.join(__dirname, "..", oldProduct.productImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.productImage = `/uploads/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log("Product Updated Success");
    return res.redirect("/product/view");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    // Delete product image
    if (product.productImage) {
      let filePath = path.join(__dirname, "..", product.productImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log("Product Deleted Success");
    return res.redirect("/product/view");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
