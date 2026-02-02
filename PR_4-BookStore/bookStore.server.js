const express = require("express");
const app = express();
const PORT = 9090;
const storeConnect = require("./src/config/bookStoreConnect");
app.use(express.static("public"));

const bookStoreRoutes = require("./src/routes/bookStore.route");

storeConnect();

app.set("view engine", "ejs");
app.use(express.urlencoded({}));

app.use("/", bookStoreRoutes);

app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`);
});
