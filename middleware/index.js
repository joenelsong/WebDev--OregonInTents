// all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");


var middlewareObj = {};


// Campground Authorization Check Function

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
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
  
};

// Comment Authorization Check Function
middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is a user logged in?
  if(req.isAuthenticated()) { 
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
        res.redirect('back');
      } else {
        // does user own the comment?
        if(foundComment.author.id.equals(req.user._id)) { // must use .equals() === will not work because they are different objects
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
  
};

// Simple check to see if a user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


module.exports = middlewareObj;