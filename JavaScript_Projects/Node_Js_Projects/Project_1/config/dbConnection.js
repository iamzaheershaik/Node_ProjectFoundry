require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('CONNECTED TO MONGO DB'))
    .catch((err) => console.log(err))

