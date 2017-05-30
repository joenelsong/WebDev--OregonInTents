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
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds:allCampgrounds} );
    }
  });
});


// NEW Route - show form to create new campground
router.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new.ejs");
});


// CREATE Route - add new campground to DB
router.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc}
  
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds"); // default is to redirect as a get request
    }
  });
});


//SHOW Route - render show template for a campground
router.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
      res.render("campgrounds/campground404");
    } else {
      console.log(foundCampground);
      //render show template with that acmpground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

module.exports = router;