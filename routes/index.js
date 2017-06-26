var express = require('express');
var router = express.Router();
var passport     = require('passport');
var User          = require('../models/user');

var reCaptcha = { siteKey:'6LeY4CQUAAAAAMSWbEG_zffmN3NQJIvgbR6TLMwP',
                  secretKey:'6LeY4CQUAAAAAMgXhZJrX3rirT0TPhamsGB-IZLp'};
var request           = require('request');


// ROOT ROUTE
router.get("/", function(req, res) {
  res.render("landing");
});

router.get("/members", function(req, res) {
  res.render("members");
});

// ==============
// AUTH ROUTES
// ==============

// Show registration form
router.get('/register', function(req, res) {
  res.render('register', {page: 'register'});
});

// Handle sign up logic
router.post('/register', function(req, res) {
  
  
  // ===============
  // Captcha Test 
  // ===============

 // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    req.flash('error', "Please select captcha");
    return res.redirect('register');
    
  }
  // Put your secret key here.
  var secretKey = "--paste your secret key here--";
  // req.connection.remoteAddress will provide IP address of connected user.
  console.log(reCaptcha.secretKey);
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + reCaptcha.secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    console.log(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
       req.flash('error', "Failed captcha verification");
       return res.redirect('register');
       
    }
    // If successful, continue processing registration.
    //res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    // ==================
    // Create New User
    // ==================
    var newUser = new User( {username: req.body.username, email: req.body.email} );  // Must use username as that's what passport is expecting, otherwise Bad Request http error.
    User.register(newUser, req.body.password,  function(err, user) {
      if(err){
        console.log(err);
        req.flash('error', err.message); // below causes flash message, don't need this.
        return; // will cause flash message, so don't need above.
      }
      
      console.log("New User Registered: " + newUser);
      
      passport.authenticate('local')(req, res, function(){
        req.flash('success', 'Thank you for registering an account: (' +user.username+') with OregonInTents!')
        return res.redirect('/campgrounds'); //redirect to campground show page
      });
    });
    
  });
  
});


// Show Login form
router.get('/login', function(req, res) {
  res.render('login', {page: 'login'});
});

// handling login logic
router.post('/login', passport.authenticate('local', 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true // optional, see text as well
  }), function(req, res){
  
});

// Logout Route
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', "Logged out successfully.");
    res.redirect('/campgrounds');
});

// function matchPasswords(pw1, pw2) {
//   if (pw1 === pw2) {
//     return true;
//   }
//   return false;
// }

/*
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = "--paste your secret key here--";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });
*/

module.exports = router;