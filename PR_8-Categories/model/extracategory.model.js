const mongoose = require("mongoose");

const extracategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  description: {
    type: String,
  },
  extracategoryImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Extracategory", extracategorySchema);
