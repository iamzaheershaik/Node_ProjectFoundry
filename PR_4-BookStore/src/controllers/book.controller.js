const Book = require("../model/bookStore.model");

exports.getBooks = async (req, res) => {
  const search = req.query.search || "";
  const books = await Book.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { genre: { $regex: search, $options: "i" } }
    ]
  });
  res.render("index", { books });
};

exports.addBook = async (req, res) => {
  await Book.create({
    ...req.body,
    cover: req.file.filename
  });
  res.redirect("/");
};

exports.deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/");
};

exports.editBookPage = async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("edit", { book });
};

exports.updateBook = async (req, res) => {
  let data = req.body;
  if (req.file) data.cover = req.file.filename;

  await Book.findByIdAndUpdate(req.params.id, data);
  res.redirect("/");
};
