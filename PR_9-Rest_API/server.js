const express = require("express");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 7092;
const dbConnect = require("./config/dbConnection");

dbConnect();
const app = express();

// middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//routes
const routes = require("./routes/index.routes");
app.use("/", routes);

//start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
