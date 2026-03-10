const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("./middleware/passport-local-strategy");
const BlogConnect = require("./config/dbConnection");
const indexRoutes = require("./routes/index.routes");

const app = express();
const PORT = 8000;

BlogConnect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "blogAuthSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticate);


app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




app.use("/", indexRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
