const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String },
  price: { type: Number },
  genre: { type: String },
  cover: { type: String },
});

module.exports = mongoose.model("Book", bookSchema);
