const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.URI

mongoose.connect(DB,)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
 