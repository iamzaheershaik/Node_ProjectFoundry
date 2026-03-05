const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: String,
    categoryImage: String
});

module.exports = mongoose.model("Category", categorySchema);