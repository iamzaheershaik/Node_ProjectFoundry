const express = require("express"); //step - 1
const authRouter = require("./routes/auth.routes")

const app = express();// step-2

app.use("/api/auth", authRouter);

//middleware
app.use(express.json());// used to read the data from in req.body 

module.exports = app; // step-3 use in server.js