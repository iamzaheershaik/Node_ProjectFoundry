const express = require('express');
const app = express();
const PORT = 8080;
app.set("view engine", "ejs")
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/tables", (req, res) => {
  res.render("tables");
});

app.get("/widgets", (req, res) => {
  res.render("widgets");
});

app.get("/grid", (req, res) => {
  res.render("grid");
});

app.get("/charts", (req, res) => {
  res.render("charts");
});

app.listen(PORT, ()=>{
    console.log(`Server started at port http://localhost:${PORT}`)
})