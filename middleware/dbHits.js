/*
 * Metrics
 *   Returns the data metrics associated with an athlete AID
 *   
 */
module.exports.Metrics = function(req, res, AID, cb) {
  console.log('fileter metrics');
  var school = req.school;
  var Models = req.models;
  var notThis = ['_id', '__v', 'SID', 'MID', 'AID', 'teams'];
  var deliver = {};

  var metrics = athleteModels(Models);
  // console.log('13:dbHits --> metrics:', metrics);
  if (metrics.length > 4) metrics.pop();
  metrics.forEach(function(el, ind, arr) {
    Models[el].findOne({AID: AID}, function(err, doc) {
      // console.log('doc', doc);
      var modelMetrics = [];
      for (var key in doc._doc) {
        var rosterMetrics = {};
        if (notThis.indexOf(key.toString()) === -1) {
          // check that the metric has at least one value
          if (doc[key].length > 0) {
            // console.log('23:key', key);
            // either add one value or add all the values
            if (doc[key].length > 1) {
              // console.log('greater than 1');
              var sortedValues =  doc[key].sort(dtSort);
              rosterMetrics[key] = sortedValues[0];
              // console.log('rosterMetrics', rosterMetrics[0]);
            } else {
              // console.log('less than 1');
              rosterMetrics[key] = doc[key][0];
              // console.log('rosterMetrics', rosterMetrics);
            }
            modelMetrics.push(rosterMetrics);
            // console.log('modelMetrics', modelMetrics);
          }
        }
      }
      deliver[el] = modelMetrics;
      // console.log('deliver\n', deliver);

      for (var key in deliver) {
       while (deliver[key].length > 1) {
         deliver[key].pop();
       }
      }
      // console.log('deliver:keys', Object.keys(deliver).length);
      // console.log('metrics.length', metrics.length);
      if (Object.keys(deliver).length === metrics.length) {
        // console.log('deliver\n', deliver);
        // sort in alphabetical order
        var sDeliver = {};
        metrics = metrics.sort(dtSort);
        for (var i = 0; i < metrics.length; i++) {
          sDeliver[metrics[i]] = deliver[metrics[i]];
        }
        // console.log('sDeliver\n', sDeliver);
        cb(sDeliver);
      }
    });
  });
};

// temporal sorter: descending order
function dtSort(a, b) {
  return a.dt < b.dt ?  1  // the first value is less
       : a.dt > b.dt ? -1  // the first value is greater
       : 0;                                // a and b are equal
}

// return the athlete models : recordTime and Metrics ignored
function athleteModels(Models) {
  var arr = [];
  for (var key in Models) {
    if (key != "RecordTime" && key != "Metric") {
      arr.push(key);
    }
  }
  return arr;
}
