const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({
    url: String,
    id:String,
    detailUrl: String,
    title: Object,
    price: Object,
    description: String,
    details: Object,
    discount:String,
    tagline: String 
})

module.exports = mongoose.model("product",productSchema);