var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose = require("mongoose"),
    passport     = require('passport'),
    LocalStrategy = require('passport-local'),
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


// =================
// Requiring Routes
// =================
var commentRoutes = require('./routes/comments');
var campgroundsRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);


// Start Server
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The OregonInTents Server Has Started.");
});