const mongoose = require("mongoose"); // mongoose provide step -7

function dbConnect() { // step - 8 provide string
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`DataBase is connected Successfully`);
    })
    .catch((err) => {
      console.error("DB Error:", err);
      process.exit(1);
    });
}
module.exports = dbConnect; //export and use server not app step - 8 
