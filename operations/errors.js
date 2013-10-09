;"use strict";
var crypto = require('crypto');


function cliErrors(err) {
  var Errors = {
    "maxCharacters": {
        id: errorId(),
        code: "val01v1",
        msg: "Input exceeds the number of characters allowed",
        rescode: 422,
        name: "maxCharacters"
      },
    "invalidInput": {
        id: errorId(),
        code: "val02v1",
        msg: "Not valid input",
        rescode: 422,
        name: "invalidInput"
    },
    "notFound": {
        id: errorId(),
        code: "val03v1",
        msg: "Resource not found",
        rescode: 404,
        name: "notFound"
    },
    "invalidIDinput": {
        id: errorId(),
        code: "val03v1",
        msg: "Not a valid id",
        rescode: 422,
        name: "invalidIDinput"
    }
  };

  return Errors[err];
}

function dbErrors(err) {
  var Errors = {
    11000: function(err) {
      err.id = errorId();
      err.msg = "Resource already in database";
      err.rescode = 409;
      err.name = err.err;
      return err;
    },
    11001: function(err) {
      err.id = errorId();
      err.msg = "Resource already in database";
      err.rescode = 409;
      err.name = err.err;
      return err;
    }
  };

  if (Errors[err.code]) {
    return Errors[err.code](err);
  }
  else {
    err.id = errorId();
    err.msg = "Database error";
    err.rescode = 500;
    err.name = err.err;
    return err;
  }
}

function errorId() {
  var date = new Date;
  return crypto.createHash('sha1').update(date.toString()).digest('hex');
}


module.exports.cliErrors = exports = cliErrors;
module.exports.dbErrors = exports = dbErrors;
