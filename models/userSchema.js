const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const userSchema =  new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email address")
            }
        }
    } ,
    phoneNumber: {
        type:String,
        required:true,
        unique:true,
        maxlength:10
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    confirmPassword: {
        type:String,
        required:true,
        minlength:6
    },
    carts:Array,
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ],
   
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12)
        
    }
    next();
})

userSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}
userSchema.methods.addcartdata = async function(cart) {
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoose.model("user",userSchema);