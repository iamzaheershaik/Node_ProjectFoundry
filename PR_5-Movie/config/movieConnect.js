const mongoose = require("mongoose");

const movieConnect = () => {
    mongoose
        .connect(
            "mongodb+srv://zaheershaik0323_db_user:Zaheer%404321@cluster0.wes2cx2.mongodb.net/MovieDB",
        )
        .then(() => console.log("DB Is Connected"))
        .catch((err) => console.log(err));
};

module.exports = movieConnect;
