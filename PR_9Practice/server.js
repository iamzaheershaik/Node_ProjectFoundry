const express = require("express");
const mongoose = require("mongoose");

const app = express(); // this is the object of express server
const PORT = 8094;

app.use(express.json());

//dataBase connection
mongoose
  .connect(
    "mongodb+srv://zaheershaik0323_db_user:Zaheer%404321@cluster0.wes2cx2.mongodb.net/API_Product",
  )
  .then(() => {
    console.log("DataBase is Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/products", (req, res) => {
  res.send({ message: "All Products" });
});

app.get("/products/:id", (req, res) => {
  console.log(req.params.id);
  res.send({ message: "Single Product id" });
});

app.post("/products", (req, res) => {
  console.log(req.body);
  res.send({ message: "Post is Requested" });
});

app.delete("/products/:id", (req, res) => {
  console.log(`${req.params.id} is deleted `);
  res.send({ message: "Deleted the Product" });
});

app.put("/products/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  res.send({ message: "Put is Successful" });
});

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Mandotory"],
    },
    price: {
      type: Number,
      required: [true, "Price is Mandotory"],
      min: 1,
    },
    quantity: {
      type: Number,
      required: [true, "Price is Mandotory"],
    },
    category: {
      type: String,
      enum: ["Clothing", "Electronics", "HouseHold"],
    },
  },
  { timeStamps: true },
);

const productModel = mongoose.model("products", ProductSchema);

app.listen(8094, () => {
  console.log(`Server is running on http://localhost/${PORT}`);
});
