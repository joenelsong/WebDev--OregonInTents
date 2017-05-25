var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose = require("mongoose"),
    
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");
    
//seedDB();
    
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_v3");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res) {
  res.render("landing");
});

//////////////////////////////////
// INDEX  Route - show all campgrounds
//////////////////////////////////
app.get("/campgrounds", function(req, res) {
  //Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds:allCampgrounds});
    }
  });
});


/////////////////////////////////////////////
// NEW Route - show form to create new campground
/////////////////////////////////////////////
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new.ejs");
});


/////////////////////////////////////////
// CREATE Route - add new campground to DB
/////////////////////////////////////////
app.post("/campgrounds", function(req, res) {
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


///////////////////////////////////////////////
//SHOW Route - render show template for a campground
///////////////////////////////////////////////
app.get("/campgrounds/:id", function(req, res) {
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

// ==================
// COMMENT ROUTES
// ==================
app.get("/campgrounds/:id/comments/new", function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res){
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


//redirect to campground show page

// Start Server
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The OregonInTents Server Has Started.");
});