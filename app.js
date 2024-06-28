const express = require("express")
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes/router.js')
const cookieParser = require('cookie-parser')
require("./db/connection.js")
require("dotenv").config();

const productModel = require('./models/productSchema.js')
const DefaultData = require('./defaultdata.js')


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

const port = process.env.PORT || 8005;

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}

app.listen(port,()=>{
    console.log(`server is listening on port number ${port}`);
}   
)    

DefaultData();