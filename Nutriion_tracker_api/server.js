require("dotenv").config();

const app = require("./src/app"); //come from server.js step-4
const dbConnect = require("./src/config/db"); // come from config previouse steps in config db.js file step -9 

const PORT = 7890; // step -5 assign a POrt

//MONGO DB CONNECTION 
dbConnect(); // made a config connection of mongodb step - 10 

app.listen(PORT, () => { // step - 6 server start at this post 
  console.log(`Server is running on the ${PORT}`)
})