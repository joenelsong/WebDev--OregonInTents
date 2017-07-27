var express         = require('express');
var router          = express.Router();
var passport        = require('passport');
var User            = require('../models/user');
var Campground      = require('../models/campground');
var request         = require('request');
var async           = require('async');
var nodemailer      = require('nodemailer');
var crypto          = require('crypto'); // part of node, no need to install
var stripe          = require("stripe")("sk_test_4YlRVGTwtC5Z6fwLmEt98HB4");


// ROOT ROUTE
router.get("/", function(req, res) {
  res.render("landing");
});

router.get("/members", function(req, res) {
  res.render("members", {page: 'members'});
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

  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.GOOGLE_RECAPTCHA_API_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
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
    

    // Validate Email Address Pattern
    var reEmailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reEmailFormat.test(req.body.email) == false) {
      req.flash('error', "Invalid Email Address"); // below causes flash message, don't need this.
      return res.redirect('/register'); // will cause flash message, so don't need above.
    }
    
    // ==================
    // Create New User
    // ==================
    var newUser = new User( {username: req.body.username, email: req.body.email} );  // Must use username as that's what passport is expecting, otherwise Bad Request http error.
    User.register(newUser, req.body.password,  function(err, user) {
      if(err){
        console.log(err);
        req.flash('error', err.message); // below causes flash message, don't need this.
        return res.redirect('/register'); // will cause flash message, so don't need above.
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


// Forgot password Route
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({email: req.body.email }, function(err, foundUser) {
        if(!foundUser) {
          req.flash('error', 'No account associated with that email address exists.');
          return res.redirect('/forgot');
        }
        
        foundUser.resetPasswordToken = token;
        foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        foundUser.save(function(err) {
          done(err, token, foundUser);
        });
      });
    },
    function( token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'OregonInTents@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'OregonInTents@gmail.com',
        subject: 'Password Reset Request',
        text: 'A password reset has been requested on your OregonInTents account.\n' +
          'If you have requested this please click the following link or paste it into your browser to continue with your password reset.\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, you can ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Password reset email has been sent.');
        req.flash('success', 'An email has been sent to '+ user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if(err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, foundUser) {
    if(!foundUser) {
      req.flash('error', 'Your password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, foundUser) {
        if(!foundUser) {
           req.flash('error', 'Your password reset token is invalid or has expired.');
           return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          foundUser.setPassword(req.body.password, function(err) { // using passport mongoose to set password
            foundUser.resetPasswordToken = undefined;
            foundUser.resetPassportExpires = undefined;
            
            foundUser.save(function(err) {
              req.logIn(foundUser, function(err){
                done(err, foundUser);
              });
            });
          });
        } else { // make sure new password and confirmation of new password match
            req.flash('error', 'Password do not match, try again.');
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'OregonInTents@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'OregonInTents@AUTOMSG.com',
        subject: 'Your password has been changed',
        text: 'Hello, \n\n' + 'This is a confirmation that the password for your account: '+ user.username + ' Has been changed.'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

// Donate
router.get('/donate', function(req, res) {
  res.render('donate');
});

router.get('/paysuccess', function(req, res) {
  res.render('paysuccess');
});

router.post('/charge/:amt', function(req, res) {
  var token = req.body.stripeToken;
  // Charge the user's card:
  var charge = stripe.charges.create({
    amount: req.params.amt,
    currency: "usd",
    description: "Example charge",
    source: token,
  }, function(err, charge) {
    if(err && err.type ==="StripeCardError") {
      req.flash('error', 'Your card was declined');
    } else {
      req.flash('success', "Thank you for your support! Your donation of $" + (req.params.amt/100) + " has been processed.");
    }
    res.redirect('/campgrounds')
    // asynchronously called
  });
});



// Catch all
router.get("/:anything", function(req, res) {
  res.redirect("/campgrounds");
});



module.exports = router;