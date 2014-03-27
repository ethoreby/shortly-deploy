// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.pre('save', function(next) {
  var hash = bcrypt.hashSync(this.password);
  this.password = hash;
  next();
});

userSchema.methods.compareHash = function(attPassword, callback) {
  bcrypt.compare(attPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
