var express = require('express');
var router = express.Router();
var    passport     = require('passport');
var User          = require('../models/user');


// ROOT ROUTE
router.get("/", function(req, res) {
  res.render("landing");
});


// ==============
// AUTH ROUTES
// ==============

// Show registration form
router.get('/register', function(req, res) {
  res.render('register');
});
// Handle sign up logic
router.post('/register', function(req, res) {
  console.log("TEST\nTEST\nTEST\nTEST\n" + req.body.username);
  var newUser = new User( {username: req.body.username} );  // Must use username as that's what passport is expecting, otherwise Bad Request http error.
    User.register(newUser, req.body.password, function(err, user) {
      if(err){
        console.log(err);
        return res.redirect('register');
      }
      passport.authenticate('local')(req, res, function(){
        res.redirect('/campgrounds'); //redirect to campground show page
      });
    });
});


// Login form route
router.get('/login', function(req, res) {
  res.render('login');
});

// handling login logic
router.post('/login', passport.authenticate('local', 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
  
});

// Logout Route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;