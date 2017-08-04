var express         = require('express');
var request         = require('request');
var router          = express.Router();

var Campground      = require("../models/campground");
var User            = require("../models/user");

var myMiddleware    = require('../middleware'); // node will automatically require index.js because it is named index.js
var geocoder        = require('geocoder');

// ===================
// CAMPGROUNDS ROUTES
// ===================


// SHOW  Route - show specified user

router.get("/user-profile", myMiddleware.isLoggedIn, function(req, res) {
  //console.log(req.user);
    res.render("user-profile/index", {page: 'user-profile'} );

});
router.get("/user-profile/:id", myMiddleware.isLoggedIn, function(req, res) {
  //console.log(req.user);
    
    res.render("user-profile/show", {page: 'user-profile'} );

});


// NEW Route - show form to create new campground
router.get("/campgrounds/new", myMiddleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new.ejs");
});


// CREATE Route - add new campground to DB
router.post("/campgrounds", myMiddleware.isLoggedIn, function(req, res) {
  var name = titleCase(req.body.name);
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  }
  var price = req.body.price;
  var location ='';
  
  
  // Get Geo Spatial Data from geocoder
  var state = "Oregon";
  var geoLocationString = req.body.name + " " + req.body.city + ", " + state;
  geocoder.geocode(geoLocationString, function (err, data) {
    
    if(err) {
      console.log(err);
      return;
    } 
    
      if (data.results.length > 0) {
        console.log(data.results[0].address_components);
        
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        location = data.results[0].formatted_address;
      }
    
    //var addCount = data.results[0].address_components.length;
    // var city=data.results[0].address_components[1]['long_name'];
    // var county=data.results[0].address_components[2]['long_name'];
    // var state=data.results[0].address_components[3]['long_name'];
    
  
    var city = req.body.city;
    var image = req.body.image;
    var website = req.body.website;
    var instructions = req.body.directions;
    
    var isSecret = req.body.secretCheckbox;
    console.log(isSecret + instructions);
  
    var newCampground = { name: name, price: price, website: website, description: desc, author: author, 
                          location: location, lat: lat, lng: lng, city: city, state: state,
                          isSecret: isSecret, instructions: instructions };
    if (image.length > 0) {
      newCampground.image = image;
    }
  
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
        console.log('routes/campgrounds.js >> ' + err);
      } else {
        //redirect back to campgrounds page
        console.log(newlyCreated);
        
        req.flash('success', "Campground created successfully. Please review your campground details and feel free to make any changes/updates at any time");
        res.redirect("/campgrounds/"+newlyCreated._id); // default is to redirect as a get request
      }
    });
  }); // END geocoder.geocode(req.body.loc, function (err, data) {
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
      //console.log(foundCampground['website']);
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
  // Get Geo Spatial Data from geocoder
  var location ='';
  var state = "Oregon";
  var geoLocationString = req.body.campgroundForm.name + " " + req.body.campgroundForm.city + ", " + state;
  //console.log(geoLocationString);
  geocoder.geocode(geoLocationString, function (err, data) {
    
    if(err) {
      console.log(err);
      return;
    } 
    
    if (data.results.length > 0) {
      console.log(data.results[0].address_components);
      
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      location = data.results[0].formatted_address;
    } else 
    {
      var lat = -1;
      var lng = -1;
    }
    
    
    var newData = Object.assign(req.body.campgroundForm, {lat: lat, lng: lng, location: location} );
    console.log(newData);
      
    // find and update the specified campground
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground) {
      if(err){
        req.flash('error', err.message);
        res.redirect('/campgrounds');
      } else {
        //redirect to show page
        req.flash('success', 'Successfully Updated Campground!');
        res.redirect('/campgrounds/' + req.params.id);
      }
    });

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

// REVIEW::APPROVE Route - 
router.put('/campgrounds/:id/approve', myMiddleware.checkMembership, myMiddleware.checkNotCampgroundOwnership, function(req, res){
  // find and update the specified campground
  Campground.findByIdAndUpdate(req.params.id, {$set: {adminApproved : true} }, function(err, updatedCampground) {
    if(err){
      req.flash('error', err.message);
      res.redirect('/campgrounds');
    } else {
        // Award points to Reviewing user
        if (myMiddleware.awardPublicPoints(req.user._id, 1) === false) {
          console.log("awardPublicPoints FAILED!");
        }
        // Award points to submitting user
        if (myMiddleware.awardPublicPoints(updatedCampground.author.id, 2) === false) {
          console.log("awardPublicPoints FAILED!");
        }
        //redirect to show page
        req.flash('success', 'Campground has been successfully Approved! \n+1 Forest Power!');
        res.redirect('/campgrounds/' + req.params.id);
        
    }
  });

});

// REVIEW::REJECT Route - 
router.put('/campgrounds/:id/reject', myMiddleware.checkMembership, myMiddleware.checkNotCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err){
      req.flash('error', err.message);
      res.redirect('/campgrounds');
    } else {
      if (foundCampground.hasBeenReviewed === false) { // if false then campground has not yet been reviewed
      
        // Delete Campground because it has been rejected
        Campground.findByIdAndRemove(req.params.id, function(err) {
          if(err) {
            res.redirect("/campgrounds");
          } else {
                // Award points to user
            if (myMiddleware.awardPublicPoints(req.user._id, 1) === false) {
              console.log("awardPublicPoints FAILED!");
            }
            req.user.publicPoints = 1;
            req.flash('success', "The campground has been rejected \n+1 Forest Power!");
            res.redirect("/campgrounds");
          }
        });

      }
    }
    
  });

});


function titleCase(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


module.exports = router;