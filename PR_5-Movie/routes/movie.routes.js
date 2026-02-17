const express = require("express");
const router = express.Router();
const moviecontrol = require("../controllers/movie.controller");
const movieUpload = require("../middleware/movie.image");

router.get("/", moviecontrol.getMovies);
router.post("/add", movieUpload.single("poster"), moviecontrol.addMovie);
router.get("/edit/:id", moviecontrol.editMoviePage);
router.post(
    "/update/:id",
    movieUpload.single("poster"),
    moviecontrol.updateMovie,
);
router.get("/delete/:id", moviecontrol.deleteMovie);

module.exports = router;
