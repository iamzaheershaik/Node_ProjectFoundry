const express = require("express");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 7092;
const dbConnect = require("./config/dbConnection");
const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

dbConnect();
const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));


const routes = require("./routes/index.routes");
app.use("/", routes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
