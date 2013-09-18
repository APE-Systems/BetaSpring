;"use strict";
var mongoose = require('mongoose')
  , Sessions, ape;

//TODO:
//  will use REDIS for session handling
ape = mongoose.createConnection("mongodb://localhost:27017/ape?safe=true");
Sessions = ape.model('sessions', require('../models/schemas/sessions'));

module.exports.models = function(school, callback) {
  var models = {};

  switch(school) {

    case "universityofiowa":
      models.Coaches = iw.model('coaches', require('./schemas/coaches'));
      models.Teams = iw.model('teams', require('./schemas/teams'));
      models.Athletes = iw.model('athletes', require('./schemas/athletes'));
      models.MetricCats = iw.model('metriccats', require('./schemas/metricCategories'));
      models.Metrics = iw.model('metrics', require('./schemas/metrics'));
      models.Athmetrics = iw.model('athmetrics', require('./schemas/athmetrics'));
      models.Groups = iw.model('groups', require('./schemas/groups'));
      // models.RecordTime = iw.model('recordTimes', require('./schemas/recordTime'));
      return callback(null, models);

    case "universityofsoutherncalifornia":
      models.Coaches = usc.model('coaches', require('./schemas/coaches'));
      models.Teams = usc.model('teams', require('./schemas/teams'));
      models.Athletes = usc.model('athletes', require('./schemas/athletes'));
      models.MetricCats = usc.model('metriccats', require('./schemas/metricCategories'));
      models.Metrics = usc.model('metrics', require('./schemas/metrics'));
      models.Athmetrics = usc.model('athmetrics', require('./schemas/athmetrics'));
      models.Groups = usc.model('groups', require('./schemas/groups'));
      // models.RecordTime = usc.model('recordTimes', require('./schemas/recordTime'));
      return callback(null, models);

    case "texastechuniversity":
      models.Coaches = tt.model('coaches', require('./schemas/coaches'));
      models.Teams = tt.model('teams', require('./schemas/teams'));
      models.Athletes = tt.model('athletes', require('./schemas/athletes'));
      models.MetricCats = tt.model('metriccats', require('./schemas/metricCategories'));
      models.Metrics = tt.model('metrics', require('./schemas/metrics'));
      models.Athmetrics = tt.model('athmetrics', require('./schemas/athmetrics'));
      models.Groups = tt.model('groups', require('./schemas/groups'));
      // models.RecordTime = tt.model('recordTimes', require('./schemas/recordTime'));
      
      return callback(null, models);

    default:
      var err = 'models index.js: global models not catching';
      return callback(err, null);
  }
};