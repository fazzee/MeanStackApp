const express = require("express");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Router = express.Router();

Router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result =>{
        res.status(201).json({
          message : "user saved successfully",
          result: result
        });
      }).catch(err =>{
         res.status(500).json({
           message: "User Already Exists"
         });

      });
    });
});

Router.post("/login", (req, res, next)=>{
  let fethcedUser;
   User.findOne({email: req.body.email}).then(user =>{
     if(!user){
       return res.status(401).json({
         message: "Authentication Failed"
       });
     }
     fethcedUser = user;
      return bcrypt.compare(req.body.password, user.password);
   }).then(result => {
     if(!result){
      return res.status(401).json({
      message: "Authentication Failed"
      });
     }

    const token = jwt.sign({email: fethcedUser.email, userId: fethcedUser._id},
      "hamari_secret_key_hy_yeh_bandhu",
      {expiresIn: '1h'}
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fethcedUser._id
     });
   }).catch(err =>{
    return res.status(401).json({
      message: "Invalid Email or Password Try Again"
   });
});
});





module.exports = Router;
