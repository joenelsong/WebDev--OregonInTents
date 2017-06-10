var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {type: Boolean, default: false},
  isMember: {type: Boolean, default: false},
  publicPoints: {type: Number, default: 0},
  secretPoints: {type: Number, default: 0}
  
});

UserSchema.plugin(passportLocalMongoose); // add methods to user for passport.js

var userModel = mongoose.model('User', UserSchema);

module.exports = userModel;