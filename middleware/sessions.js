;"use strict";

/*
  MIDDLEWARE: Sessions
    monitors if the user is already logged in or not upon every request
 */

var SessionOPS = require('../operations').Sessions;

module.exports = exports = {

  isLoggedIn: function(req, res, next) {
      console.log('Middleware: isLoggedIn');
      // var session_id = req.cookies.session;
      var session_id = "523a1cc6b7bdb660f912e067";
      SessionOPS.getSession(session_id, function(err, session) {
          if (!err && session.username) {
              console.log('username in session');
              req.username = session.username;
              req.school = session.school;
          }
          return next();
      });
    }
}