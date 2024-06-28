const express = require('express')
const productModel = require('../models/productSchema')
const router = express.Router();
const userModel = require('../models/userSchema.js')
const bcrypt = require('bcrypt')

const authenticate = require('../middlewares/authenticate.js');

router.get('/products',async (req,res)=>{
    try {
        const productsdata = await productModel.find();
        res.status(200).json(productsdata)
    } catch (error) {
        console.log("error" + error.message);
    }
})

router.get("/getproductsone/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const individualdata = await productModel.findOne({id});
       
        
        if (!individualdata) {
            
            return res.status(404).json({ message: "Product not found" });
          }
        
        
        res.status(201).json(individualdata);
    } catch (error) {
        res.status(401).send({message:error.message})
    }
})

router.post('/register',async (req,res)=>{
    const {name,email,confirmPassword,password,phoneNumber} = req.body;
    if(!name || !email || !confirmPassword || !password || !phoneNumber){
        res.status(422).json({error:"fill all the data"});
    }
    {
        try {
            const preuser = await userModel.findOne({email})

            if(preuser){
                res.status(422).json({error:"User already exists"})
            }else if(password !== confirmPassword){
                res.status(422).json({error:"Password didn't match"})
            }else{
                const user = new userModel({
                    name,
                    email,
                    phoneNumber,
               
                    password,
                });
                
                const storedata = await user.save();
              

                res.status(201).json(storedata);
            }
        } catch (error) {
            res.status(401).json(error)
        }
    }
})


router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(400).json({error:"fill all the data"})
    };

    try {
        const userlogin = await userModel.findOne({email})
        if(userlogin){
            const isMatch =await bcrypt.compare(password,userlogin.password)
            
            const token = await userlogin.generateAuthToken();
             
            res.cookie("Amazonweb",token,{
                expires:new Date(Date.now() + 9000000),
                httpOnly:true
            })
            if(!isMatch){
                res.status(400).json({error:"invalid details"})
            }else{
                res.status(201).json({message:"password matched"}) 
            }
        }else{
            res.status(400).json({error:"invalid details"}) 
        }
    } catch (error) {
        res.status(400).json({error:"invalid details"})
    }
})

router.post('/addcart/:id',authenticate,async (req,res)=>{
   try {
    const {id} = req.params;
    const cart = await productModel.findOne({id})
   

    const userContact = await userModel.findOne({_id:req.userID});
    
    if(userContact){
        const cartdata = await userContact.addcartdata(cart)
        await userContact.save();
        
        res.status(201).json(userContact)
    }else{
        res.status(401).json({error:"invalid user"})
    }
   } catch (error) {
    res.status(401).json({error:"invalid user"})
   }
})

router.get("/cartdetails",authenticate,async(req,res)=>{
    try {
        const buyuser = await userModel.findOne({_id:req.userID})
        res.status(201).json(buyuser);
    } catch (error) {
        console.log("error"+error);
    }
})
router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const validuser = await userModel.findOne({_id:req.userID})
        res.status(201).json(validuser);
    } catch (error) {
        console.log("error"+error);
    }
})

router.delete("/remove/:id",authenticate,async(req,res)=>{
    try {
        const {id} = req.params;
    req.rootuser.carts = req.rootuser.carts.filter((cruval)=>{
        return cruval.id != id
    })
    req.rootuser.save();
    res.status(201).json(req.rootuser)
    console.log("item removed");
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.get("/logout",authenticate,(req,res)=>{
    try {
        req.rootuser.tokens = req.rootuser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        })

        res.clearCookie("Amazonweb",{path:"/"})
        req.rootuser.save()
        res.status(201).json(req.rootuser.tokens)
        console.log("user logout");
    } catch (error) {
        console.log("error for user logout");
    }
})
module.exports = router; 