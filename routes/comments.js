var express = require('express');
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var myMiddleware = require('../middleware'); // node will automatically require index.js because it is named index.js


// ==================
// COMMENT ROUTES
// ==================

// NEW Comment Route - 
router.get("/campgrounds/:id/comments/new", myMiddleware.isLoggedIn, function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log("campground.js >> " + err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// CREATE Comment Route -
router.post("/campgrounds/:id/comments", myMiddleware.isLoggedIn, function(req, res){
//lookup campground using ID
  Campground.findById(req.params.id, function(err, cg){
    if(err){
      console.log("campground.js >>  " + err);
      res.flash('error', 'Campground not found');
      res.render("campgrounds/campground404");
    } else {
      
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err) { 
          console.log(err) 
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          
           //associate new comment to campground
          cg.comments.push(comment);
          cg.save();
          req.flash('success', 'Successfully added comment')
          res.redirect("/campgrounds/" + cg._id);
        }
      });

    }
  });
});

// EDIT Comment Route - show edit form
router.get("/campgrounds/:id/comments/:comment_id/edit", myMiddleware.checkCampgroundOwnership, function(req, res) {
  // find coment
  var comment = Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err) {
      res.redirect('back');
    } else {
      // find campground
      var campground = Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
          res.redirect('back');
        } else {
          res.render("comments/edit", {campground :foundCampground, comment : foundComment} );
        }
      });
    }
  });
});

// UPDATE Comment Route - push edit updates to database
router.put("/campgrounds/:id/comments/:comment_id", myMiddleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
  
});

// DESTROY Comment Route - delete comment
router.delete("/campgrounds/:id/comments/:comment_id", myMiddleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if(err) {
      // 'failed to remove comment'
      res.redirect('back');
    } else {
      // 'comment successfully removed'
      req.flash('success', "Your comment has been successfully deleted.");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});





module.exports = router;