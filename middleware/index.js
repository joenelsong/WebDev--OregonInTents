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
        req.flash('error', "Campground not found");
        res.redirect('back');
      } else {
        
        // does user own campground? or is user administrator?
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) { // must use .equals() === will not work because they are different objects
          // authorize the edit
          next();
        } else {
          // Deny access to edit and reload page
          req.flash('error', "You don't have permission to do that!");
          res.redirect("back");
        }
      }
  });
  } else {
    req.flash('error', "Hmm, You should be logged in to find this page");
    res.redirect('back'); // takes user back to where they came from
  }
  
};

// Comment Authorization Check Function
middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is a user logged in?
  if(req.isAuthenticated()) { 
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
        req.flash('error', 'Cannot find comment');
        res.redirect('back');
      } else {
        
        // does user own the comment? or is user an administrator?
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) { // must use .equals() === will not work because they are different objects
          // authorize the edit
          next();
        } else {
          // Deny access to edit and reload page
          res.redirect("back");
        }
      }
  });
  } else {
    req.flash('error', "Hmm, You should be logged in to find this page");
    res.redirect('back'); // takes user back to where they came from
  }
  
};

// Simple check to see if a user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You need to be logged in to do that.'); // adds flash to next request, so we have to handle in /login
  res.redirect('/login');
}


module.exports = middlewareObj;