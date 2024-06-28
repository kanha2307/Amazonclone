const productModel = require('./models/productSchema')
const productdata = require('./constants/productdata')

const DefaultData = async ()=>{
    try {
        await productModel.deleteMany({});

        const storeData = await productModel.insertMany(productdata);
        
    } catch (error) {
        console.log('error' + error.message);
    }
}


module.exports = DefaultData;