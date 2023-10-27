const express=require("express");
const User=require('../models/User');
const router=express.Router();
const {body,validationResult}=require('express-validator')
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const fetchUser=require('../middleware/fetchUser');
const JWT_SECRET='2hayhwyGWRPUG1PUGPYYFQGSP';
//create a user using: post "/api/auth" does not require auth
router.post('/createUser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email!').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5}),
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    };
    //check whether the user with this email exists already
    try{
        let user=await User.findOne({
            email:req.body.email
        });
        if(user){
            return res.status(400).json({
                error:"Sorry a user with this email already exists!"
            })
        }
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        user=await User.create({
            name:req.body.name,
            password:secPass,
            email:req.body.email
        });
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        
        res.json(authtoken);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Some error Occured!");
    }
});
//Authentication a user using: POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter a valid email!').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5}),
],async(req,res)=>{
    //if there are errors return bad request and the errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                error:"Please try to login with correct credentials"
            });
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({
                error:"Please try to login with correct credentials"
            })
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        res.json(authtoken);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Internal server error occured!");
    }
})

//Router 3: Get Loggedin user Details using: POST "/api/auth/getuser"
router.post('/getUser',fetchUser,async(req,res)=>{
    //if there are errors return bad request and the errors
    try {
        const  userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});
module.exports=router;