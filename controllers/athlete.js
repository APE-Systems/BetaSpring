var Athlete = require('../models').Athletes
  , School = require('../models').Schools
  , stats = require('../middleware').stats
  , filter = require('../middleware').dbHits
  , moment = require('moment');

var labels = {
      'bioHT': 'Body Height (in)',
      'bioBW': 'Body Weight (lbs)',
      'bioBF': 'Body Fat (%)',
      'bioBFsf': 'Body Fat-SF (%)',
      'reach': 'Reach (in)',
      'appToHt': 'Approach Touch Height (in)',
      'appVJ': 'Approach Vertical Jump (in)',
      'stVJ': 'Standing Vertical Jump (in)',
      'stVJToHt': 'Standing Vertical Jump Touch (in)',
      'pwVJ': 'Vertical Jump (in)',
      'pwLJ': 'Long Jump (in)',
      'pwFJht': 'Four Jump (ht)',
      'pwFJgct': 'Four Jump (gct)',
      'brdJ': 'Broad Jump',
      'SquJump40': '40% Squat Jump (pp)',
      'SquJump20': '20k Squat Jump (watts)',
      'medBall': 'Medicine Ball (ft)',
      'tenyds': '10 YDS (sec)',
      'twnyds': '20 YDS (sec)',
      'thtyds': '30 YD Sprint (avg)',
      'frtyds': '40 YD Sprint (sec)',
      'thrhdyds': '300 YD Shuttle (sec)',
      'fvmbk': 'Five Mile Bike (time)',
      'hm1h': 'Home-1st (sec-hand)',
      'hm1e': 'Home-1st (sec-elec)',
      'hm2': 'Home-2nd (sec)',
      'hh': 'H-H (sec-hand)',
      'hmr1': '1/2 Mile (rep 1)',
      'hmr2': '1/2 Mile (rep 2)',
      'hmavg': '1/2 Miles (avg)',
      'proAgL': 'Pro Agility L (sec)',
      'proAgR': 'Pro Agility R (sec)',
      'proAgLa': 'Pro Agility L (avg)',
      'proAgRa': 'Pro Agility R (avg)',
      'pcl': 'Power Clean (lbs)',
      'hgcl': 'Hang Clean (lbs)',
      'hgclsh': 'Hang Clean Shrug (lbs)',
      'squ': 'Squat (lbs)',
      'bsq': 'Back Squat (lbs)',
      'fsq': 'Front Squat (lbs)',
      'dsq': 'Deep Sq (reps)',
      'bp': 'Bench Press (lbs)',
      'ir': 'Inv. Row (rep)',
      'pu': 'Pull Ups (reps)',
      'chup': 'Chin Ups (reps)',
      'hstp': 'Hurdle Step (reps)',
      'illg': 'IL Lunge (reps)',
      'shmob': 'SH Mob',
      'aslr': 'ASLR (reps)',
      'stbpu': 'Stability PU (reps)',
      'rtstb': 'Rot Stability (reps)',
      'wgpk': 'Wingate Peak (watts)',
      'wgrel': 'Wingate Relative (watts/lbs)'
      };

module.exports.get = function(req, res) {
  console.info('\n\r---------------------');
  console.log('AJAX: get athlete by ID:', req.params.id);
  console.info('---------------------');
  var Models = req.models;
  var AID = req.params.id;
  var school = req.school.replace(/ /g, '');
  getAthleteById(res, AID, function(athlete) {
    filter.Metrics(req, res, AID, function(metrics) {
      // console.log('get metrics', metrics);
      var labs = {};
      for (var key in metrics) {
        // console.log('key', key);
        // console.log('metrics[key]', metrics[key][0]);
        if (metrics[key][0]) {
          // console.log('Object.keys', Object.keys(metrics[key][0])[0]);
          labs[Object.keys(metrics[key][0])[0]] = labels[Object.keys(metrics[key][0])[0]];
        }
      }
      // console.log('labs', labs);
      console.log('return AJAX');
      res.json({
          athlete: athlete,
          Metrics: metrics,
          labels: labs
      });
    });
  });
};  // end get

module.exports.profile = function(req, res) {
  console.info('\n\r---------------------');
  console.log('Date:', new Date());
  console.log('user:', req.fullname);
  console.log('get athlete profile:', req.params.id, '\n');
  console.info('---------------------');

  var METRICS = [];
  var school = req.school;
  var Models = req.models;
  var AID = req.params.id;

  latestRecord(school, Models, function(date) {
    console.log('latestRecord Done');
    getAthleteById(res, AID, function(athlete) {
      console.log('getAthleteById Done');
      stats.getAverage(school, Models, athlete.teams[0], function(profMetrics, avgs) {
        console.log('profile metrics\n', profMetrics);
        bundle(profMetrics, avgs, function(averages) {
          console.log('averages\n', averages);
          stats.getDelta(school, AID, Models, function(deltas) {
            console.log('deltas\n', deltas);
            getAthleteMetric(Models, res, athlete, function(athMetrics) {
              // console.log('athMetrics:112', athMetrics);
              getModelMetrics(Models, res, profMetrics, athMetrics, function(DOCS) {
                getModelMetricValue(profMetrics, DOCS, function(metricValues) {
                  console.log('metricValues\n', metricValues);

                  for (var i = 0; i < profMetrics.length; i++) {
                    var model = profMetrics[i].model;
                    var keys = profMetrics[i].keys;
                    var preLoad = {};
                    var packIt = {
                      averages: averages[model],
                      deltas: deltas[model]
                    };
                    for (var j = 0; j < keys.length; j++) {
                      packIt[keys[j]] = metricValues[model][keys[j]];
                    }
                    preLoad[model] = packIt;
                    METRICS.push(preLoad);
                    // console.log('profile METRICS', METRICS);
                  }
                  // console.log('profileMetrics.length', profMetrics.length);
                  // console.log('profileMetrics', profMetrics);
                  // console.log('METRICS.length', METRICS.length);
                  // console.log('METRICS', METRICS);
                  if (METRICS.length === profMetrics.length) {
                    console.log('render profile');
                    res.render('profile', {
                      athletes: [athlete],
                      school: req.school.replace(/ /g, ''),
                      Metrics: METRICS,
                      labels: labels
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  });
}; // end profile

module.exports.getChart = function(req, res) {
  var id, model, metric, Models;
  id = req.params.id;
  model = req.params.metric;
  metric = req.params.el;
  Models = req.models;

  console.info('\n\r---------------------');
  console.log('AJAX: get athlete ID: ObjectId("' + id + '")');
  console.log('AJAX: get athlete metric:', model);
  console.log('AJAX: get athlete element:', metric);
  console.info('---------------------');

// get the chart data
  getChartMetric(res, id, model, metric, Models, function(chartData) {
    console.log('chartData', chartData);
    res.json(chartData);
  });

}; // end get chart

/*
 * ---------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------
 * ---------------------------HELPER FUNCTIONS--------------------------------------
 * ---------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------
*/

/*
 * Get the metric value for the current date
 */
function getModelMetricValue(profMetrics, DOCS, cb) {
  var metricValues = {};
  for (var i = 0; i < profMetrics.length; i++) {
    var model = profMetrics[i].model;
    var keys = profMetrics[i].keys;
    // console.log('model', model, 'keys', keys);
    // console.log('DOCS', DOCS);
    var vals = {};
    for (var k = 0; k < keys.length; k++) {
      // console.log('key', keys[k]);
      var values = DOCS[model][keys[k]].sort(dtSort);
      // console.log('values', values);
      if (values[0]) {
        if (values[0].val.replace(/[ a-zA-Z\*\(\)]/g, '') !== '') {
          vals[keys[k]] = values[0].val.replace(/[ a-zA-Z\*\(\)]/g, '');
        } else {
          vals[keys[k]] = '--';
        }
      }
    }
    metricValues[model] = vals;
  }
  cb(metricValues);
}

/*
 * Bundle the averages for packaging in METRICS
 */
function bundle(metrics, avgs, cb) {
  var mlen, alen, model, label, averages = {};
  mLen = metrics.length;
  aLen = avgs.length;
  for (var i = 0; i < mLen; i++) {
    model = metrics[i].model;
    averages[model] = {};
      for (var j = 0; j < aLen; j++) {
        mLabel = avgs[j].label;
        if (metrics[i].keys.indexOf(mLabel) != -1) {
          // console.log(mLabel, avgs[j].avg);
          // console.log(mLabel, isNaN(Math.round(avgs[j].avg*100)/100) ? avgs[j].avg : Math.round(avgs[j].avg*100)/100);
          averages[model][mLabel] = isNaN(Math.round(avgs[j].avg*100)/100) ? avgs[j].avg : Math.round(avgs[j].avg*100)/100;
        }
      }
    }
  cb(averages);
}

/*
 * Get Athlete By ID
 */
function getAthleteById(res, id, cb) {
  // console.log('id', id);
  Athlete.findById(id, 'fullname teams school position group year metrics', function(err, athlete) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('getAthleteById query(_id):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/athlete.getAthleteById/' + err.code +'/');
    }
    // console.log('athlete', athlete);
    cb(athlete);
  });
}

/*
 * Get Athlete Metric
 */
function getAthleteMetric(Models, res, athlete, cb) {
  Models.Metric.findById(athlete.metrics, function(err, metric) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('getAthleteMetric query(_id):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/athlete.getAthleteMetric/' + err.code +'/');
    }
    // console.log('261:metric', metric);
    cb(metric);
  });
}

/*
 * Get Athlete Model Metric
 */
function getModelMetrics(req, res, profMetrics, athMetric, cb) {
  // console.log('athMetric', athMetric);
  var DOCS = []; // count holder
  var objs = {}; // return 
  for (var i = 0; i < profMetrics.length; i++) {
    var model = profMetrics[i].model;
    var keys = profMetrics[i].keys;
    (function(model, keys) {
      var fields = keys.join(' ');
      req[model].findOne({MID: athMetric._id}, fields, function(err, docs) {
        if (err) {
          console.error('\n----ERROR----');
          console.error('getAthleteBioMetric query(MID):\n' + err);
          console.error('-------------');
          return res.redirect('/internal_error/athlete.getAthleteBioMetric/' + err.code +'/');
        }
        // returns all fields in the documents
        objs[model] = docs;
        DOCS.push(objs);
        // when all the documents from the models are populated, cb
        if (DOCS.length === profMetrics.length) {
          cb(objs);
        }
      });
    })(model, keys);
  }
}

/*
 * Identify and call the metric
 */
function getChartMetric(es, id, model, metric, Models, cb) {
  Models[model].findOne({AID: id}, metric, function(err, doc) {
    // console.log('dates', doc[metric]);
    doc = doc[metric].sort(dtSort);
    // console.log('doc', doc);
    cleanData(doc, function(chartData) {
      cb(chartData);
    });
  });
}

// Sorting UNIX timestamps
// temporal sorter: descending order
function tSort(a, b) {
  return a < b ?  1  // the first value is less
       : a > b ? -1  // the first value is greater
       : 0;                                // a and b are equal
}

// Sorting MONGO timestamps
// temporal sorter: descending order
function dtSort(a, b) {
  return a.dt < b.dt ?  1  // the first value is less
       : a.dt > b.dt ? -1  // the first value is greater
       : 0;                                // a and b are equal
}

/*
 * Get latest record
 */
function latestRecord(school, Models, cb) {
  School.findOne({name: school}, function(err, school) {
    Models.RecordTime.find({}, {time: 1}, function(err, dates) {
      if (err) throw err;
      // console.log('dates', dates);
      dates = dates[0].time.sort(tSort);
      cb(dates[0]);
    });
  });
}

/*
 * Clean the data
 * Remove empty data and NaN
 */
function cleanData(doc, cb) {
  var val, i;
  var labels = [];
  var values = [];
  var chartData = {};
  for (i = 0; i < doc.length; i++) {
    val = doc[i].val.replace(/[a-zA-Z\*\(\)]/g, '');
    if (val !== '') {
      labels.push(moment(doc[i].dt).format("MMM DD YYYY"));
      values.push(val);
    }
  }
  chartData = {values: values.reverse(), labels: labels.reverse()};
  cb(chartData);
}
