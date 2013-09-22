;"use strict";

/*
  MIDDLEWARE: School Models
    A user has access only to their Schools Models
 */
var Mods = require('../models/db/config').getModels;

module.exports = exports = {

  getSchoolModels: function(req, res, next) {
    if (req.sess.username) {
      req.models = new Mods(req.sess.school);
      console.log('middleware: Models');
      return next();
    }
    return next();
  }

}