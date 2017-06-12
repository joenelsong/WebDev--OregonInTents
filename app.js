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
var fs                = require("fs");
var flash = require('connect-flash');


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// ==========================
// Passport Configuration
// ==========================

app.use(require('express-session') ({ // session tracker
  secret: 'here we are born to be kings we are the princes of the universe',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// Setup App.locals Variables
// ==========================

app.locals.moment = require('moment'); // make moment available in all view files
// Put currentUser Variable in res.locals so we can access it from all of our templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.user; 
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});
    

    
// ==========================
// Connect to Mongo Database
// ==========================

//seedDB(); // seed the database -- broken, just deletes for now
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/OregonInTents13");  // local test database
// Other test database is on mLab.

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };   

/*var contents = fs.readFileSync("Credentials.json"); // Get credentials from file
var jsonContent = JSON.parse(contents); // Define to JSON type
var mongoServer = jsonContent.testServer;
var mongoServer = jsonContent.productionServer;
var mongodbUri = "mongodb://"+mongoServer.username+":"+mongoServer.password+"@"+mongoServer.server;
mongoose.connect(mongodbUri, options);
*/
mongoose.connect(process.env.DATABASE_URL, options);

var conn = mongoose.connection;

process.env.databaseURL
 
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
  // Wait for the database connection to establish, then start the app.                         
});


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