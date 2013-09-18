"use strict";

var SessionOPS = require('../operations').Sessions;

module.exports = exports = {

  isLoggedIn: function(req, res, next) {
      var session_id = req.cookies.session;
      SessionOPS.getUsername(session_id, function(err, username) {
        console.log('operations response');
          if (!err && username) {
              console.log('username in session');
              req.username = username;
          }
          return next();
      });
    }
}