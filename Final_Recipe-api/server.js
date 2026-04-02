
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();
const indexRoutes  = require("./routes/indexRoutes")

const app = express();
connectDB();

app.use(express.json());          
app.use(cookieParser());         

app.use('/api',indexRoutes);

app.use((err, _req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 7689;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));