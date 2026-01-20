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
  const todoDescription = req.body.description;

  if (todoText !== "") {
    todoList.push({
      text: todoText,
      description: todoDescription,
      completed: false
    });
  }

  res.redirect("/");
});
app.post("/delete", (req, res) => {
  const todoIndex = req.body.index;
  todoList.splice(todoIndex, 1);
  res.redirect("/");
});

app.get("/edit/:index", (req, res) => {
  const index = req.params.index;
  res.render("edit", { todo: todoList[index], index });
});

app.post("/edit/:index", (req, res) => {
  const index = req.params.index;
  const { task, description } = req.body;

  todoList[index].text = task;
  todoList[index].description = description;

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


