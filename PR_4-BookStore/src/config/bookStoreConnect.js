const mongoose = require("mongoose");

const bookStoreConnect = () => {
  mongoose
    .connect(
      "mongodb+srv://zaheershaik0323_db_user:Zaheer%404321@cluster0.wes2cx2.mongodb.net/MangaStore",
    )
    .then(() => console.log("DB Is Connected"))
    .catch((err) => console.log(err));
};
module.exports = bookStoreConnect;
