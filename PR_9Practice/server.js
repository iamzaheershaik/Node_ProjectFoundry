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
  productModel
    .find()
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Some Problem" });
    });
});

app.get("/products/:id", (req, res) => {
  productModel
    .findOne({ _id: req.params.id })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Some Problem" });
    });
});

app.post("/products", (req, res) => {
  let product = req.body;
  console.log(product);
  productModel
    .create(product)
    .then((document) => {
      res.send({ data: document, message: "Product Created" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Some Problem" });
    });
});

app.delete("/products/:id", (req, res) => {
  productModel
    .deleteOne({ _id: req.params.id })
    .then((info) => {
      res.send({ message: "Product is Deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Some Problem" });
    });
});

app.put("/products/:id", (req, res) => {
  let product = req.body;
  productModel
    .updateOne({ _id: req.params.id }, product)
    .then((info) => {
      res.send({ message: "Product is Updated" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Some Problem" });
    });
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
  { timestamps: true },
);

const productModel = mongoose.model("products", ProductSchema);

app.listen(8094, () => {
  console.log(`Server is running on http://localhost/${PORT}`);
});
