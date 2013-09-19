// var Athlete = require('../models').Athletes;

// Returns the latest metric value for each athlete on a team
// params.id - the team identifier
// query.category - the category of the metric
// query.metric - the metric to return
module.exports.index = function(req, res) {
  console.info('\n\r---------------------');
  console.info('Training Index');
  console.info('API: /teams/' + req.params.team + '/metrics/latest');
  console.info('Model: ' + req.query.category);
  console.info('Metric: ' + req.query.metric);
  console.info('---------------------');

  var team = req.params.team;
  var category = req.query.category;
  var metric = req.query.metric;
  var Models = req.models;

  getAllAthletes(team, 'id', function(athletes) {
    // console.log('athletes', athletes);
    var ids = [];
    for (var id in athletes) {
      ids.push(athletes[id]._id);
    }

    // console.log('athletes ids', ids);
    var fields = 'AID ' + metric;
    // console.log('fields', fields);
    getModelMetrics(Models, category, { AID: { $in: ids } }, fields, function(metricList) {
      // console.log('metricList', metricList);
      var metrics = {};
      for (var index in metricList) {
        var athlete = metricList[index];
        var aid = athlete.AID;
        var athMetric = athlete[metric];
        if (athMetric.length > 0) {
          var values = athlete[metric].sort(dtSort)[0].val;
          //NOTE: regex does not apply to new input data
          values = values.replace(/[ a-zA-Z\*\(\)]/g, '');
          metrics[aid] = values !== '' ? values : '--';
        } else {
          metrics[aid] = '--';
        }
      }
      // console.log('metrics', metrics);
      res.json(200, {
        metrics: metrics
      });
    });
  });
};

// Alphabetical Sort
function alphaSort(a, b) {
  return a < b ? -1
       : a > b ? 1
       : 0;
}

// Sorting MONGO timestamps
// temporal sorter: descending order
function dtSort(a, b) {
  return a.dt < b.dt ?  1  // the first value is less
       : a.dt > b.dt ? -1  // the first value is greater
       : 0;                                // a and b are equal
}

// return array of the metrics associated with a specific model and/or query
function getModelMetrics(Models, model, query, fields, cb) {
  query = query || {};
  fields = fields || {};
  if (fields instanceof Array) {
    fields = fields.join(' ');
  }
  Models[model].find(query, fields, function(err, metricDocs) {
    if (err) throw err;
    return cb(metricDocs);
  });
}

// get all athletes per team
function getAllAthletes(team, field, cb) {
  field = field || {};
  if (field instanceof Array) {
    field = field.join(' ');
  }
  Athlete.find({ teams: { $in: [team] }}, field, function(err, athletes) {
    if (err) throw err;
    console.log('  number of athletes', athletes.length + '\n');
    // console.log('getAthletes', athletes);
    return cb(athletes);
  });
}
