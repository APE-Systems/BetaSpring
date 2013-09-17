var mongoose = require( 'mongoose' )
  , ape, iw, usc, tt;

var mongo = {
      ape: 'mongodb://localhost:27017/ape?safe=true',
      iw: 'mongodb://localhost:27017/IW?safe=true',
      usc: 'mongodb://localhost:27017/USC?safe=true',
      tt: 'mongodb://localhost:27017/TT?safe=true'
};

ape = mongoose.createConnection(mongo.ape);
iw = mongoose.createConnection(mongo.iw);
usc = mongoose.createConnection(mongo.usc);
tt = mongoose.createConnection(mongo.tt);

console.log('connected to Mongo@ localhost:27017/ape, localhost:27017/iw, localhost:27017/usc, localhost:27017/tt');

// APE models
module.exports.Schools = ape.model('schools', require('./schemas/schools'));
module.exports.Coaches = ape.model('coaches', require('./schemas/coaches'));
// TODO:
// create school database replicas


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
      // models.RecordTime = iw.model('recordTimes', require('./schemas/recordTime'));
      return callback(null, models);

    case "universityofsoutherncalifornia":
      models.Coaches = usc.model('coaches', require('./schemas/coaches'));
      models.Teams = usc.model('teams', require('./schemas/teams'));
      models.Athletes = usc.model('athletes', require('./schemas/athletes'));
      models.MetricCats = usc.model('metriccats', require('./schemas/metricCategories'));
      models.Metrics = usc.model('metrics', require('./schemas/metrics'));
      models.Athmetrics = usc.model('athmetrics', require('./schemas/athmetrics'));
      // models.RecordTime = usc.model('recordTimes', require('./schemas/recordTime'));
      return callback(null, models);

    case "texastechuniversity":
      models.Coaches = tt.model('coaches', require('./schemas/coaches'));
      models.Teams = tt.model('teams', require('./schemas/teams'));
      models.Athletes = tt.model('athletes', require('./schemas/athletes'));
      models.MetricCats = tt.model('metriccats', require('./schemas/metricCategories'));
      models.Metrics = tt.model('metrics', require('./schemas/metrics'));
      models.Athmetrics = tt.model('athmetrics', require('./schemas/athmetrics'));
      // models.RecordTime = tt.model('recordTimes', require('./schemas/recordTime'));
      return callback(null, models);

    default:
      var err = 'models index.js: global models not catching';
      return callback(err, null);
  }
};