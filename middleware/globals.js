module.exports.loadModels = function(req, res, next) {
  var models = require('../models').models(req.user.school);
  // load models per school
  var metricModels = {};
  for (var mod in models) {
    metricModels[mod] = models[mod];
  }
  req.models = metricModels;
  return next();
};
