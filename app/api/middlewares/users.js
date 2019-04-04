const userModel = require('../models/users');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
module.exports = {
 exists: function(req, res, next) {
   userModel.findOne({email:req.body.email}, function(err, user){
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else if (user){
    	let err = new Error("User already exists" + user); //Error for console.
    	err.status = 409;
    	next(err);
    } else{
      next();
    }
 });
 }

}