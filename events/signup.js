;"use strict";
/*
  EVENTS: SignupPage
*/
var CT = require('../modules/country-list');
var signupOps = require('../operations').Signup;

var SignupEvts = {

  displaySignup: function(req, res, next) {
    console.log('Event: displaySignup');
    res.render('signup', {
      title: 'Signup',
      countries: CT
    });
  },

  addNewAccount: function(req, res, next) {
    console.log('Event: addNewAccount');
    signupOps.addNewAccount(req, function(err, success) {
      console.log('err', err);
      if (err) {
        console.error("signupPage: Error\n", err.name);
        res.send(err.msg, err.rescode);
      } 
      else {
        console.log('signupPage: Success');
        res.send('ok', 200);
      }
    });
  }

}

module.exports = exports = SignupEvts;