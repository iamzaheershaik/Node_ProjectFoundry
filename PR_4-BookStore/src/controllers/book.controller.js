const Book = require("../model/bookStore.model");
const fs = require("fs");
const path = require("path");

exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.render("index", { books });
};

exports.addBook = async (req, res) => {
  try {
    const bookPath = req.file ? `uploads/${req.file.filename}` : "";
    await Book.create({
      ...req.body,
      cover: bookPath
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
exports.deleteBook = async (req, res) => {
  let bookID = req.params.id;
  const book = await Book.findById(bookID);
  if (!book) {
    console.log('book not found')
  }
  let coverPath;
  if (book.cover != "") {
    coverPath = path.join(__dirname, "../../public", book.cover);
    try {
      await fs.unlinkSync(coverPath);
    } catch (error) {
      console.log("cover is missing")
    }
  }
  await Book.findByIdAndDelete(bookID);
  res.redirect("/");
};
exports.editBookPage = async (req, res) => {
  const bookID = req.params.id
  const book = await Book.findById(bookID);
  res.render("edit", { book });
};

exports.updateBook = async (req, res) => {
  try {
    const bookID = req.params.id;
    const book = await Book.findById(bookID);
    let data = req.body;
    delete data.cover;
    if (req.file) {
      if (book.cover && book.cover !== "") {
        const oldPath = path.join(__dirname, "../../public", book.cover);
        try {
          fs.unlinkSync(oldPath);
        } catch (error) {
          console.log("Old cover missing");
        }
      }
      data.cover = `uploads/${req.file.filename}`;
    }
    await Book.findByIdAndUpdate(bookID, data);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};


