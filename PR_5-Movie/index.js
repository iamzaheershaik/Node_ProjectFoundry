const express = require("express");
const path = require('path');
const app = express();
const PORT = 9095;
const movieDB = require("./config/movieConnect");
app.use(express.static(path.join(__dirname, "public")));

const movieRoutes = require("./routes/movie.routes");

movieDB();
app.set("view engine", "ejs");
app.use(express.urlencoded({}));
app.use("/", movieRoutes);

app.listen(PORT, () => {
    console.log(`Server start at http://localhost:${PORT}`);
});