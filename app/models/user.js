// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

User.on('creating', function(err, thisUser) {
  console.log("creating------------------------------", thisUser.username);
});

/*
See:

hooks.js
Example

var toySchema = new Schema(..);

toySchema.pre('save', function (next) {
  if (!this.created) this.created = new Date;
  next();
})

toySchema.pre('validate', function (next) {
  if (this.name != 'Woody') this.name = 'Woody';
  next();
})
*/


//  ({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
