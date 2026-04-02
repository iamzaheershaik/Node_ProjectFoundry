const express = require("express"); //step - 1
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");

const app = express();// step-2

//middleware - must be before routes so req.body is available
app.use(express.json());// used to read the data from in req.body 
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);

module.exports = app;