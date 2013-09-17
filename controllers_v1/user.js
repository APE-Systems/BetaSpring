var Athlete = require('../models').Athletes
  , Coach = require('../models').Coaches
  , Session = require('../models').Sessions
  , filter = require('../middleware').dbHits;

var labels = {
    "bioHT": "Body Height (in)",
    "bioBW": "Body Weight (lbs)",
    "bioBF": "Body Fat (%)",
    "bioBFsf": "Body Fat-SF (%)",
    "reach": "Reach (in)",
    "appToHt": "Approach Touch Height (in)",
    "appVJ": "Approach Vertical Jump (in)",
    "stVJ": "Standing Vertical Jump (in)",
    "stVJToHt": "Standing Vertical Jump Touch (in)",
    "pwVJ": "Vertical Jump (in)",
    "pwLJ": "Long Jump (in)",
    "pwFJht": "Four Jump (ht)",
    "pwFJgct": "Four Jump (gct)",
    "brdJ": "Broad Jump",
    "SquJump40": "40% Squat Jump (pp)",
    "SquJump20": "20k Squat Jump (watts)",
    "medBall": "Medicine Ball (ft)",
    "tenyds": "10 YDS (sec)",
    "twnyds": "20 YDS (sec)",
    "thtyds": "30 YD Sprint (avg)",
    "frtyds": "40 YD Sprint (sec)",
    "thrhdyds": "300 YD Shuttle (sec)",
    "fvmbk": "Five Mile Bike (time)",
    "hm1h": "Home-1st (sec-hand)",
    "hm1e": "Home-1st (sec-elec)",
    "hm2": "Home-2nd (sec)",
    "hh": "H-H (sec-hand)",
    "hmr1": "1/2 Mile (rep 1)",
    "hmr2": "1/2 Mile (rep 2)",
    "hmavg": "1/2 Miles (avg)",
    "proAgL": "Pro Agility L (sec)",
    "proAgR": "Pro Agility R (sec)",
    "proAgLa": "Pro Agility L (avg)",
    "proAgRa": "Pro Agility R (avg)",
    "cl": "Clean (lbs)",
    "cl1rm": "Clean 1RM (lbs)",
    "cl2rm": "Clean 2RM (lbs)",
    "cl3rm": "Clean 3RM (lbs)",
    "cldf1rm": "Clean Deadlift 1RM (lbs)",
    "cldf2rm": "Clean Deadlift 2RM (lbs)",
    "cldf3rm": "Clean Deadlift 3RM (lbs)",
    "pcl": "Power Clean (lbs)",
    "pcl1rm": "Power Clean 1RM (lbs)",
    "pcl2rm": "Power Clean 2RM (lbs)",
    "pcl3rm": "Power Clean 3RM (lbs)",
    "hgpcl": "Hang Power Clean (lbs)",
    "hgpcl1rm": "Hang Power Clean 1RM (lbs)",
    "hgpcl2rm": "Hang Power Clean 2RM (lbs)",
    "hgpcl3rm": "Hang Power Clean 3RM (lbs)",
    "hgcl": "Hang Clean (lbs)",
    "hgsn": "Hang Snatch (lbs)",
    "hgsn1rm": "Hang Snatch 1RM (lbs)",
    "hgsn2rm": "Hang Snatch 2RM (lbs)",
    "hgsn3rm": "Hang Snatch 3RM (lbs)",
    "sn": "Snatch (lbs)",
    "sn1rm": "Snatch 1RM (lbs)",
    "sn2rm": "Snatch 1RM (lbs)",
    "sn3rm": "Snatch 1RM (lbs)",
    "hgpsn": "Hang Power Snatch (lbs)",
    "hgpsn1rm": "Hang Power Snatch 1RM (lbs)",
    "hgpsn2rm": "Hang Power Snatch 2RM (lbs)",
    "hgpsn3rm": "Hang Power Snatch 3RM (lbs)",
    "hgclsh": "Hang Clean Shrug (lbs)",
    "squ": "Squat (lbs)",
    "bsq": "Back Squat (lbs)",
    "bsq1rm": "Back Squat 1RM (lbs)",
    "bsq2rm": "Back Squat 2RM (lbs)",
    "bsq3rm": "Back Squat 3RM (lbs)",
    "fsq": "Front Squat (lbs)",
    "dsq": "Deep Sq (reps)",
    "bp": "Bench Press (lbs)",
    "pjk1rm": "Push Jerk 1RM (lbs)",
    "pjk2rm": "Push Jerk 2RM (lbs)",
    "pjk3rm": "Push Jerk 3RM (lbs)",
    "spjk1rm": "Split Jerk 1RM (lbs)",
    "spjk2rm": "Split Jerk 2RM (lbs)",
    "spjk3rm": "Split Jerk 3RM (lbs)",
    "sngdf1rm": "Snatch Grip Deadlift 1RM (lbs)",
    "sngdf2rm": "Snatch Grip Deadlift 2RM (lbs)",
    "sngdf3rm": "Snatch Grip Deadlift 3RM (lbs)",
    "ir": "Inv. Row (reps)",
    "pu": "Pull Ups (reps)",
    "chup": "Chin Ups (reps)",
    "hstp": "Hurdle Step (reps)",
    "illg": "IL Lunge (reps)",
    "shmob": "SH Mob",
    "aslr": "ASLR (reps)",
    "stbpu": "Stability PU (reps)",
    "rtstb": "Rot Stability (reps)",
    "wgpk": "Wingate Peak (watts)",
    "wgrel": "Wingate Relative (watts/lbs)"
    };

module.exports.logout = function(req, res, next) {
  // process user logout
  console.info('\n\r---------------------');
  console.info('logging out');
  console.info('---------------------');

  // remove session
  endSession(req.session, function(loginTime) {
    var logoutTime = new Date();
    res.clearCookie('.APEAUTH');
    console.info('  cookie cleared');
    console.info('  logout dateTime:', logoutTime);
    console.info('  time spent:', (logoutTime - loginTime)/1000, 'secs');
    res.redirect('/login');
  });
};// end logout

// dashboard
module.exports.dashboard = function(req, res) {
  console.info('\n\r---------------------');
  console.info('render dashboard');
  console.info('---------------------');
  res.render('dashboard', {
    username: req.user.fullname,
    school: req.user.school,
    teams: req.user.teams
  });
};// end dashboard

module.exports.rosters = function(req, res) {
  console.info('\n\r---------------------');
  console.info('render roster');
  console.info('---------------------');

  var school = req.user.school;
  var teams = req.user.teams.sort(alphaSort);

  getAllAthletes(teams[0], function(athletes) {
    // console.log("athlete[0]", athletes[0]);
    filter.Metrics(req, res, athletes[0]._id, function(metrics) {
      // console.log('39:metrics\n', metrics);
      res.render('rosters', {
        athletes: athletes,
        school: school,
        teams: teams,
        Metrics: metrics,
        labels: labels
      });
    });
  });
};// end rosters

module.exports.training = function(req, res) {
  console.info('\n\r---------------------');
  console.info('render training');
  console.info('---------------------');

  var user = req.user.username;
  var school = req.user.school;
  var teams = req.user.teams.sort(alphaSort);
  var groups = ['All'];
  var Models = req.models;
  var objLabels = {};

  getAllAthletes(teams[0], function(athletes) {
    athletes = athletes.sort(alphaSortNames);
    getTeamModelsLabels(teams[0], Models, function(modelLabels) {
      modelLabels = modelLabels.sort(alphaSort);
      getModelMetricsLabels(Models, modelLabels[0], function(metrics) {
        metrics = metrics.sort(alphaSort);
        var query = {teams: teams[0]};
        var fields = 'AID ' + metrics[0];
        getModelMetrics(Models, modelLabels[0], query, fields, function(metricList) {
          // console.log('metricList', metricList);
          var lastMetricValues = {};
          var lastMetricValuesId = {};
          for (var ind in metrics) {
            objLabels[metrics[ind]] = labels[metrics[ind]];
          }
          for (var index in metricList) {
            var athlete = metricList[index];
            // console.log('athlete', athlete);
            var aid = athlete.AID;
            var athMetric = athlete[metrics[0]];
            if (athMetric.length > 0) {
              var values = athlete[metrics[0]].sort(dtSort)[0].val;
              var dataId = athlete[metrics[0]].sort(dtSort)[0]._id;

              //NOTE: the regex is not for new input
              values = values.replace(/[ a-zA-Z\*\(\)]/g, '');

              lastMetricValues[aid] = values !== '' ? values : '--';
              lastMetricValuesId[aid] = dataId;
            } else {
              lastMetricValuesId[aid] = '';
              lastMetricValues[aid] = '--';
            }
          }
          console.log('objLabels', objLabels);
          // console.log('lastMetricValues', lastMetricValues);
          // console.log('lastMetricValuesId', lastMetricValuesId);
          res.render('training', {
            athletes: athletes,
            school: school,
            teams: teams,
            groups: groups,
            models: modelLabels,
            metricLabels: objLabels,
            lastValues: lastMetricValues,
            dataId: lastMetricValuesId
          });
        });
      });
    });
  });
};// end training

/*
 * ---------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------
 * ---------------------------HELPER FUNCTIONS--------------------------------------
 * ---------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------
*/

// return array of the metrics associated with a specific model and/or query
function getModelMetrics(Models, model, query, fields, cb) {
  query = query || {};
  fields = fields || {};
  if (fields instanceof Array) {
    fields = fields.join(' ');
  }
  Models[model].find(query, fields, function(err, metricDocs) {
    if (err) throw err;
    // console.log('241:getModelMetrics', metricDocs);
    return cb(metricDocs);
  });
}


// Get All Athletes per team
function getAllAthletes(team, cb) {
  Athlete.find({ teams: { $in: [team] }}, 'fullname teams school position group year', function(err, athletes) {
    if (err) throw err;
    console.log('  number of athletes', athletes.length + '\n');
    // console.log('getAthletes', athletes);
    return cb(athletes);
  });
}

// End session
function endSession(session, cb) {
  var loginTime = session.date;
  Session.remove({_id: session._id}, function(err, sess) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('session remove(sessionId):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/process.endSession/' + err.code +'/');
    }
    cb(loginTime);
  });
}

// Aphabetical sort on athlete names
function alphaSortNames(a, b) {
  return a.fullname.split(' ')[1] < b.fullname.split(' ')[1] ? -1
       : a.fullname.split(' ')[1] > b.fullname.split(' ')[1] ? 1
       : 0;
}

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

// returns array of the team models
function getTeamModelsLabels(team, Models, cb) {
  var models = [];
  for (var model in Models) {
    if (model != 'RecordTime' && model != 'Metric') {
      models.push(model);
    }
  }
  console.log('user:models', models);
  return cb(models);
}

// return array of the metrics associated with a specific model
function getModelMetricsLabels(Models, model, cb) {
  var notThis = ['_id', '__v', 'SID', 'MID', 'AID', 'teams'];
  var metrics = [];
  for (var key in Models[model].schema.paths) {
    if (notThis.indexOf(key.toString()) === -1) {
      metrics.push(key);
    }
  }
  console.log('user:metrics', metrics);
  return cb(metrics);
}
