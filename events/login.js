;"use strict";
/*
  EVENTS: LoginPage
*/

var loginOps = require('../operations').Login;

var loginEvts = {

  displayLogin: function(req, res, next) {
    console.log('Event: displayLogin');
    res.render('login');
  }

}

module.exports = exports = loginEvts;