var mongoose = require('mongoose');
var path = require('path');

var mongoURI = process.env.MONGO_LAB_URI || 'mongodb://localhost/';
mongoose.connect(mongoURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection successful');
});

module.exports = db;
