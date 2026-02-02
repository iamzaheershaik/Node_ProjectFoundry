const express = require("express");
const router = express.Router();
const book = require("../controllers/book.controller");
const upload = require("../middleware/bookStore.multer");

router.get("/", book.getBooks);
router.post("/add-book", upload.single("cover"), book.addBook);
router.post("/delete-book/:id", book.deleteBook);
router.get("/edit-book/:id", book.editBookPage);
router.post("/update-book/:id", upload.single("cover"), book.updateBook);

module.exports = router;
