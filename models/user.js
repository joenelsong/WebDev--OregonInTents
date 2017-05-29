var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose); // add methods to user for passport.js

var userModel = mongoose.model('User', UserSchema);

module.exports = userModel;