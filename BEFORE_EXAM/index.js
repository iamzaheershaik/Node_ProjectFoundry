const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const app = express();
const path = require("path");


dotenv.config({path:'config.env'})

const PORT = process.env.PORT || 7856;

//log requests 
app.use(morgan('tiny'))

//parse requests to express
app.use(express.urlencoded({ extended: false }));

// set view engine
app.set("view engine", "ejs")
// app.set("views", path.resolve(__dirname, "views/ejs"));

//load assests
app.use(express.static(path.resolve(__dirname, "assets")))

//routes 
app.get('/', (req, res) => {
  res.render("index")
})

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})