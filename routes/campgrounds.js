var express = require('express');
var router = express.Router();

var Campground = require("../models/campground");

// ===================
// CAMPGROUNDS ROUTES
// ===================


// INDEX  Route - show all campgrounds
router.get("/campgrounds", function(req, res) {
  //console.log(req.user);
  //Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log('campgrounds.js >> ' + err);
    } else {
      res.render("campgrounds/index", { campgrounds:allCampgrounds} );
    }
  });
});


// NEW Route - show form to create new campground
router.get("/campgrounds/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new.ejs");
});


// CREATE Route - add new campground to DB
router.post("/campgrounds", isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  }
  var newCampground = {name: name, image: image, description: desc, author: author};

  
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log('campgrounds.js >> ' + err);
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds"); // default is to redirect as a get request
    }
  });
});


//SHOW Route - render show template for a campground
router.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log('campgrounds.js >> ' + err);
      res.render("campgrounds");
    } else {
      //console.log(foundCampground);
      //render show template with that acmpground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});


// EDIT Route -
router.get('/campgrounds/:id/edit', checkCampgroundOwnership, function(req, res) {

  Campground.findById(req.params.id, function(err, foundCampground) { // no need to check for err because we already did in our middleware checkCampgroundOwnership()
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE Route - 
router.put('/campgrounds/:id', checkCampgroundOwnership, function(req, res){
  // find and update the specified campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campgroundForm, function(err, updatedCampground) {
    if(err){
      res.redirect('/campgrounds');
    } else {
      //redirect to show page
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY Route -
router.delete('/campgrounds/:id', checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});


// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
  // is a user logged in?
  if(req.isAuthenticated()) { 
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err) {
        res.redirect('back');
      } else {
        // does user own campground?
        if(foundCampground.author.id.equals(req.user._id)) { // must use .equals() === will not work because they are different objects
          // authorize the edit
          next();
        } else {
          // Deny access to edit and reload page
          res.redirect("back");
        }
      }
  });
  } else {
    res.redirect('back'); // takes user back to where they came from
  }
}

module.exports = router;