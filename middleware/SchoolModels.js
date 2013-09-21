;"use strict";

/*
  MIDDLEWARE: School Models
    A user has access only to their Schools Models
 */
var Mods = require('../models/db/config');

module.exports = exports = {

  getSchoolModels: function(req, res, next) {
    if (req.username) {
      req.models = new Mods(req.school);
      console.log('middleware: Models');
      return next();
    }
    return next();
  }

}