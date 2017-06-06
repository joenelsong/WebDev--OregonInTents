var express = require('express');
var router = express.Router();

var Campground = require("../models/campground");

var myMiddleware = require('../middleware'); // node will automatically require index.js because it is named index.js

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
router.get("/campgrounds/new", myMiddleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new.ejs");
});


// CREATE Route - add new campground to DB
router.post("/campgrounds", myMiddleware.isLoggedIn, function(req, res) {
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
router.get('/campgrounds/:id/edit', myMiddleware.checkCampgroundOwnership, function(req, res) {

  Campground.findById(req.params.id, function(err, foundCampground) { // no need to check for err because we already did in our middleware checkCampgroundOwnership()
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE Route - 
router.put('/campgrounds/:id', myMiddleware.checkCampgroundOwnership, function(req, res){
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
router.delete('/campgrounds/:id', myMiddleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      req.flash('success', "Your campground has been successfully deleted.");
      res.redirect("/campgrounds");
    }
  });
});





module.exports = router;