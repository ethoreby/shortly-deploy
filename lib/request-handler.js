/* global require, exports */

var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if(err) {
      throw err;
    }else {
      res.send(200, links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function(err, link) {
    if (link.length > 0) {
      res.send(200, link[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }else {
          Link.create({url: uri, title: title, base_url: req.headers.origin}, function(err, link){
            if(err){
              throw err;
            }else {
              res.send(200, link);
            }
          });
        }
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find( { username: username }, function(err, user){
    if(user.length === 0) {
      res.redirect("/login");
    }else {
      user[0].compareHash(password, function(match) {
        if(match) {
          util.createSession(req, res, user);
        }else {
          res.redirect("/login");
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find( { username: username }, function(err, user){
    if(user.length === 0) {
      User.create({"username": username, "password": password}, function(err, user) {
        if(err) {
          throw err;
        }else {
          console.log("created user successfully");
          util.createSession(req, res, user);
        }
      });
    }else {   //user already exists
      console.log("account already exists");
      res.redirect("/signup");
    }
  });
};

exports.navToLink = function(req, res) {
  Link.find({code: req.params[0]}, function(err, link){
    if(err) {
      throw err;
    }else {
      if(link.length === 0) {
        res.redirect("/");
      } else {
        console.log(link[0].visits, "-------------------------");
        link[0].visits = link[0].visits + 1;
        link[0].save();
        res.redirect(link[0].url);
      }
    }
  });
};

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
// };
