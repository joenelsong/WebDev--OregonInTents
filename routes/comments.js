var express = require('express');
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");


// ==================
// COMMENT ROUTES
// ==================

// Comments New
router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// Comments Create
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
//lookup campground using ID
  Campground.findById(req.params.id, function(err, cg){
    if(err){
      console.log(err);
      res.render("campgrounds/campground404");
    } else {
      
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err) { 
          console.log(err) 
        } else {
           //associate new comment to campground
          cg.comments.push(comment);
          cg.save();
          
          res.redirect("/campgrounds/" + cg._id);
        }
      });

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

module.exports = router;