const express = require("express");
const router = express.Router();
const upload = require("../config/bookStore.multer");
const book = require("../controllers/book.controller");

router.get("/", book.getBooks);
router.post("/add-book", upload.single("cover"), book.addBook);
router.post("/delete-book/:id", book.deleteBook);
router.get("/edit-book/:id", book.editBookPage);
router.post("/update-book/:id", upload.single("cover"), book.updateBook);

module.exports = router;
