var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var Account = require('../models/db/config').apeMods.Accounts;
var dbErrors = require('./errors.js').dbErrors;
var cliErrors = require('./errors.js').cliErrors;

passport.use(new LocalStrategy(
  //verify callback
  //  find user that possesses a set of credentials
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));