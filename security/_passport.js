module.exports = exports = function() {
  'use strict';

  var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

  var Account = require('../models/db/config').apeMods.Accounts;

  passport.use(new LocalStrategy(
    //verify callback
    //  find user that possesses a set of credentials
    function(username, password, done) {
      Account.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          if (!isMatch)
            return done(null, false, { message: 'Incorrect password. '});
          return done(null, user);
        });
      });
    }
  ));
};