var express           = require("express");
var app               = express();
var bodyParser        = require("body-parser");
var mongoose          = require("mongoose");
var passport          = require('passport');
var LocalStrategy     = require('passport-local');
var methodOverride    = require('method-override');
//var Campground        = require('./models/campground');
//var Comments          = require('./models/user');
var User              = require('./models/user');
var seedDB            = require("./seeds");



var flash = require('connect-flash');
app.locals.moment = require('moment'); // make moment available in all view files
    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session') ({ // session tracker
  secret: 'here we are born to be kings we are the princes of the universe',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Put currentUser Variable in res.locals so we can access it from all of our templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.user; 
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    
//seedDB(); // seed the database -- broken, just deletes for now
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/OregonInTents13");


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