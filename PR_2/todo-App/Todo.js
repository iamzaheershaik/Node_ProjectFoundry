const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static("public"));

let todoList = [];

app.get("/", (req, res) => {
  res.render("index", { todoList });
});

app.post("/add", (req, res) => {
  const todoText = req.body.task;

  if (todoText !== "") {
    todoList.push({
      text: todoText,
      completed: false
    });
  }

  res.redirect("/");
});

app.post("/toggle", (req, res) => {
  const todoIndex = req.body.index;
  todoList[todoIndex].completed = !todoList[todoIndex].completed;
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const todoIndex = req.body.index;
  todoList.splice(todoIndex, 1);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


