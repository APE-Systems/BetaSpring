;"use strict";
var mongoose = require('mongoose')
  , ape, databases = {};

ape = mongoose.createConnection('mongodb://localhost:27017/ape');
console.info('connected to APEdb');
ape.on('error', APEconnectionError);

// Upon Application StartUp, Connect to all the databases
var dbCodes, host, port, opts;
dbCodes = ape.model('dbcodes', require('../schemas/dbcodes'));
host = 'localhost';
port = 27017;
opts = {};

dbCodes.find({}, function(err, dbCodes) {
  if (err) throw new Error(err);

  var count = dbCodes.length;
  for (var i=0; i<count; i++) {
    var conn = 'mongodb://localhost:27017/' + dbCodes[i].dbcode.toUpperCase();
    if (i === count-1) {
      console.log('database connected: ' + conn + '\n');;
    } else console.log('database connected:', conn);
    databases[dbCodes[i].school] = dbCodes[i].dbcode;
    databases[dbCodes[i].dbcode] = mongoose.createConnection(conn);
    databases[dbCodes[i].dbcode].on('error', databaseConnectionError);
  }
});

function getModels(school) {
  var db = databases[databases[school]];
  var models = {
    Coaches: db.model('coaches', require('../schemas/coaches')),
    Teams: db.model('teams', require('../schemas/teams')),
    Athletes: db.model('athletes', require('../schemas/athletes')),
    MetricCats: db.model('metriccats', require('../schemas/metricCategories')),
    Metrics: db.model('metrics', require('../schemas/metrics')),
    Athmetrics: db.model('athmetrics', require('../schemas/athmetrics')),
    Groups: db.model('groups', require('../schemas/groups'))
    //RecordTime: db.model('recordTimes', require('../schemas/recordTime'));
  }

  console.log(school + ' models retrieved\n');
  return models;
};

module.exports = exports = getModels;


// ERROR HANDLERS
function databaseConnectionError(err) {
  console.error('Problem Connecting a school database');
  console.error(err);
  if (err) throw new Error(err);
}

function APEconnectionError(err) {
  console.error('Problem Connecting to APE database');
  console.error(err);
  if (err) throw new Error(err);
}

/*
module.exports = exports = function(school, callback) {

      callback(null, getModels(databases));

      function getModels(databases) {

          var db = databases[databases[school]];
          var models = {
            Coaches: db.model('coaches', require('../schemas/coaches')),
            Teams: db.model('teams', require('../schemas/teams')),
            Athletes: db.model('athletes', require('../schemas/athletes')),
            MetricCats: db.model('metriccats', require('../schemas/metricCategories')),
            Metrics: db.model('metrics', require('../schemas/metrics')),
            Athmetrics: db.model('athmetrics', require('../schemas/athmetrics')),
            Groups: db.model('groups', require('../schemas/groups'))
            //RecordTime: db.model('recordTimes', require('../schemas/recordTime'));
          }

          console.log(school + ' models retrieved\n');
          return models;
      }
};
*/