var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose = require("mongoose"),
    passport     = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User          = require('./models/user'),
    seedDB = require("./seeds");
    


// PASSPORT CONFIGURATION
app.use(require('express-session') ({
  secret: 'here we are born to be kings we are the princes of the universe',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Put currentUser Variable in res.locals so we can access it from all of our templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.user; 
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    
//seedDB();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/OregonInTents");


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
  console.log(req.user);
  //Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds:allCampgrounds} );
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
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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


// ==============
// AUTH ROUTES
// ==============

//show register form
app.get('/register', function(req, res) {
  res.render('register');
});
// handle sign up logic
app.post('/register', function(req, res) {
  var newUser = new User( {username: req.body.username} );
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


// Show login form
app.get('/login', function(req, res) {
  res.render('login');
});

// handling login logic
app.post('/login', passport.authenticate('local', 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
  
});

// Logout Route
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
// Start Server
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The OregonInTents Server Has Started.");
});