const express =  require('express');
const app = express();
const PORT = 8089;
const indexRoutes = require("./routes/index.routes.js");
//middldware 
app.use(express.urlencoded());
//routes 
app.get()