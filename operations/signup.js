;"use strict";
/*
  OPERATIONS: signUpOps
 */

var Accounts = require('../models/db/config').apeMods.Accounts;
var dbErrors = require('./errors.js').dbErrors;
var cliErrors = require('./errors.js').cliErrors;
var moment = require('moment');

var signupOps = {

  addNewAccount: function(req, evtCallback) {
    console.log('signupOPS: addNewAccount');

    var newData = req.body;

    checkUser(newData.user);

    function checkUser(user) {
      console.log('checking user');
      Accounts.findOne({user: user}, function(err, user) {
        if (err) return evtCallback(dbErrors(err), null);
        if (user)
          return evtCallback(cliErrors('usernameTaken'), null);
        console.log('user:', user);
        return checkEmail(newData.email);
      });

      function checkEmail(email) {
        console.log('checking email');
        Accounts.findOne({email: email}, function(err, email) {
          if (err) return evtCallback(dbErrors(err), null);
          if (email)
            return evtCallback(cliErrors('emailTaken'), null);
          return createAccount();
        });
      }

      function createAccount() {
        console.log('create new account');
        var newAcc = new Accounts({
            name: newData.name,
            email: newData.email,
            org: newData.org,
            country: newData.country,
            user: newData.user,
            pass: newData.pass,
            createdOn: moment().format('MMMM Do YYYY, h:mm:ss a')
        });

        newAcc.save(function (err) {
          if (err) return evtCallback(dbErrors(err), null);
          return evtCallback(null, true);
        });
      }
    }
  }

}

module.exports = exports = signupOps;