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
        var session_id = "523f650049dbbf403bca0619";
      //var session_id = "523f5dc87f3fff94d940a7a8";
      SessionOPS.getSession(session_id, function(err, session) {
          if (!err && session.username) {
              console.log('username in session');
              req.sess = session;
          }
          return next();
      });
    }
}