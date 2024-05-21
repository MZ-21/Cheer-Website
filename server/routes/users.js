require('dotenv').config()
const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt')
const sendEmail = require("../utils/emailVerification")
const Token = require('../models/token');
const jwt = require('jsonwebtoken');
const Hours = require ('../models/hours');



//creating token using jwt
const createToken= (_id)=>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'}  )
}


router.route("/signup")
.post(async(req,res)=>{
    const {email, firstName, lastName, allergies, medicalCondition, extraInfo, password, username, userType, relationship} =req.body
  
    try{
      
     const {error} = validate(req.body);
   
     if(error){
        return res.status(400).json({message :  error.details[0].message})
      
        
     }
     const account = await User.findOne({email: email});
      
     if(!account){
      
       // adding salt to the password
       const salt = await bcrypt.genSalt(Number(process.env.SALT));
       const hashPasssword = await bcrypt.hash(password, salt);

       //saving the new user account with the values
       let user = await new User({firstName:firstName, lastName:lastName, medicalCondition:medicalCondition, allergies:allergies, extraInfo:extraInfo, email:email, userType:userType, password:hashPasssword, username:username, relationship:relationship}).save();
       //creating a token for that user 
        let tokens = createToken(user._id)
      
       let tokenSaved = await new Token({
         userId: user._id,
         token: tokens
       }).save() 
      


       const url = `http://localhost:8080/api/account/${user.id}/verify/${tokenSaved.token}`;
       //user.email should be the admin's email instead.
       await sendEmail("layalquazi@gmail.com", "verify new Cheer", "Click on the link to verify "+ user.firstName + " "+ user.lastName+ " " + url)
       res.status(201).json({message: "An email has been sent to the admin, please wait to be verified before logging in."})
   
     }
     else{
       return res.json({message:"This account is already registered. Login"})
     }
    

   } 
    catch(err){
        console.log(err)
       res.status(400).json({message: "User not created"})
    }
 })

  //verification for email
  router.route('/account/:id/verify/:token')
  .get(async(req,res)=>{
    try{
        const user = await User.findOne({_id: req.params.id});
        if(!user){
            return res.status(400).json({message: "Invalid link"})
        }

      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token
      })
    
     
      if(!token){
        return res.status(400).json({message: "invalid link"});
      }

      await User.updateOne({_id:token.userId}, {$set:{verified:true}});
      console.log(token._id, " the token")
      await Token.findOneAndDelete(token._id);

      res.status(201).json({message: "emailed verified successfully"})

    }
    catch(err){
        console.log(err)
         res.status(500).json({message: err})
    }
  })


  // get client's info
  router.get("/clientInfo", async (req, res) => {
    try {
      const user = await User.findOne({ firstName: req.query.firstName, lastName: req.query.lastName });
      if (!user){
        return res.status(401).json({ data: '', message: "Unknown user" });
      }
  
      else{
      res.status(200).json({ medicalCondition: user.medicalCondition, allergies: user.allergies, extraInfo: user.extraInfo, message: "user found" });
      }
      
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // get list of clients
  router.get("/clientList", async (req, res) => {
    try {
      
      const users = await User.find({ userType: 'Client' });
      if (!users){
        return res.status(401).json({ data: '', message: "Unknown users" });
      }
  
      else{
        let list = users.map((e)=>{return {"name": e.username}});
        let emails = users.map((e)=>{return {"email": e.email}});
        res.status(200).json({ fullName: list, email: emails, message: "users found" });
      }
      
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


module.exports = router;
