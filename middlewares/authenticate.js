const jwt = require('jsonwebtoken');
const userModel = require('../models/userSchema.js');

const authenticate = async(req,res,next)=>{
    try {
        const token = req.cookies.Amazonweb;

        const verifyToken = jwt.verify(token,process.env.KEY)
       
        const rootuser = await userModel.findOne({_id:verifyToken._id,"tokens.token":token})
        

        if(!rootuser){
           res.status(400).send("not found")
        }
        req.token = token
        req.rootuser = rootuser
        req.userID = rootuser._id;

        next()
    } catch (error) {
        res.status(401).json({message:"Unauthorized: No token provided"});
        console.log(error);
    }
}
module.exports = authenticate;