require('dotenv').config()
const express = require("express");
const app = express();
const PORT = 3000;
const taskRoute = require("./routes/tasks.routes");
const connectDB = require('./db');
//middleware
app.use(express.json());

//routes
app.get("/hello", (req, res) => {
    res.send("Hello World")
}) 

app.use("/api/v1/tasks", taskRoute)

const start = async () => {
    try{
        await connectDB(Process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is Running on http://localhost:${PORT}`);
        })
    }catch (err){
        console.error(err);
    }
}
start()