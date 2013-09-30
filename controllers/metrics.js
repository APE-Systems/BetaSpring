// var athlete = require('../models').Athletes;
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
      "pcl": "Power Clean (lbs)",
      "hgcl": "Hang Clean (lbs)",
      "hgclsh": "Hang Clean Shrug (lbs)",
      "squ": "Squat (lbs)",
      "bsq": "Back Squat (lbs)",
      "fsq": "Front Squat (lbs)",
      "dsq": "Deep Sq (reps)",
      "bp": "Bench Press (lbs)",
      "ir": "Inv. Row (rep)",
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

// Returns the metrics for a given category
module.exports.index = function(req, res) {
  console.info('\n\r---------------------');
  console.info('AJAX: Category/Model Index');
  console.info('/categories/'+ req.params.category + '/metrics');
  console.info('---------------------');

  var Models = req.models;
  var model = req.params.category;
  var objLabels = {};

  getModelMetricsLabels(Models, model, function(metricLabels) {
    // console.log('metricLables sorted', metricLabels.sort(alphaSort));
    metricLables = metricLabels.sort(alphaSort);
    for (var ind in metricLables) {
      objLabels[metricLables[ind]] = labels[metricLables[ind]];
    }
    console.log('objLabels', objLabels);
    res.json(200, {
      metricLabels: objLabels
    });
  });
};

/*
 * Alphabetical Sort
 */
function alphaSort(a, b) {
  return a < b ? -1
       : a > b ? 1
       : 0;
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
  // console.log('user:metrics', metrics);
  return cb(metrics);
}

// Adds a metric and a value to a user
// params.id - athlete id
// body.category - the metric category
// body.metric - the metric to add
// body.value - the value of the metric
module.exports.create = function(req, res) {
  console.info('\n\r---------------------');
  console.info('AJAX: /athletes/' + req.params.id +'/metrics');
  console.info('Category:', req.body.category);
  console.info('Metric', req.body.metric);
  console.info('Input Value', req.body.value);
  console.info('---------------------');

  var Models = req.models;
  var aid = req.params.id;
  var category = req.body.category;
  var metric = req.body.metric;
  var value = req.body.value;
  var pushIt = {};
  pushIt[metric] = {val: value, dt: new Date()};

  Models[category].findOneAndUpdate({AID: aid}, {$push: pushIt}, {select: metric}, function(err, update) {
    if (err) throw err;
    // console.log('updated doc', update);
    // console.log('sorted:update', update[metric].sort(dtSort));
    console.log('most recent', update[metric].sort(dtSort)[0]);
    var updated = update[metric].sort(dtSort)[0];
    res.json(200, {
      update: updated
    });
  });
};

// Deletes the last metric value from a user
// params.id - athlete id
// body.category - the metric category
// body.metric - the metric to remove the last value
module.exports.destroy = function(req, res) {
  console.info('\n\r---------------------');
  console.info('AJAX: /athletes/' + req.params.id + '/metrics');
  console.info('Category:', req.body.category);
  console.info('Metric', req.body.metric);
  console.info('dataId', req.body.dataId);
  console.info('---------------------');

  var Models = req.models;
  var aid = req.params.id;
  var category = req.body.category;
  var metric = req.body.metric;
  var dataId = req.body.dataId;

  var pullIt = {};
  pullIt[metric] = {_id: dataId};
  Models[category].findOneAndUpdate({AID: aid}, {$pull: pullIt}, {select: metric}, function(err, doc) {
    if (err) throw err;
    // console.log('doc', doc);
    console.log('data removed:', dataId);
    res.json(200);
  });
};

// Sorting MONGO timestamps
// temporal sorter: descending order
function dtSort(a, b) {
  return a.dt < b.dt ?  1  // the first value is less
       : a.dt > b.dt ? -1  // the first value is greater
       : 0;                                // a and b are equal
}
