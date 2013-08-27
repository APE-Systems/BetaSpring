var Athlete = require('../models').Athletes
  , School = require('../models').Schools
  , moment = require('moment');


// Models is an array
// calculate the average value per metric
module.exports.getAverage = function(school, Models, team, cb) {
  var averages = [];
  School.findOne({name: school}, function(err, school) {
    Models.RecordTime.find({}, {time: 1}, function(err, dates) {
      if (err) throw err;
      dates = dates[0].time.sort(tSort);
      // console.log('dates', dates);
      filterModels(Models, function(mods, modNames) {
        // console.log('stats:16 mods', mods);
        // console.log('stats:17 modNames', modNames);
        filterMetrics(Models, mods, modNames, function(keys, metrics) {
          // console.log('stats:18 metrics', metrics);
          // hard code the date here
            average(Models, dates[0], keys, metrics, function(metrics, averages) {
              // console.log('average', averages);
              cb(metrics, averages);
            });
        });
      });
    });
  });
}; // end getAverage

// calculate the difference between the latest and next latest value
module.exports.getDelta = function(school, AID, Models, cb) {
  School.findOne({name: school}, function(err, skool) {
    filterModels(Models, function(mods, modNames) {
      filterMetrics(Models, mods, modNames, function(keys, metrics) {
        delta(AID, Models, keys, metrics, function(deltas) {
          // console.log('deltas', deltas);
          cb(deltas);
        });
      });
    });
  });
}; // end getDelta


/*
 *
 * HELPER FUNCTIONS
 * 
 */

// calculate the difference between the latest and next latest value
function delta(AID, Models, key, metrics, cb) {
  var deltas = {};
  metrics.forEach(function(el, ind, arr) {
    var fields = el.keys.join(' ');
    Models[el.model].find({AID: AID}, fields, function(err, doc) {
      // console.log('56 model:', el.model, '\nathlete doc:', doc, '\ndoc.length:', doc.length);
      var vals = {};
      for (var field in el.keys) {
        var label = el.keys[field];
        // console.log('59 label', label);
        if (doc[0][label].length < 2) {
          // console.log('62 doc', doc);
          vals[label] = '--';
        } else {
          // console.log('doc[0][label]', doc[0][label]);
          var dok = doc[0][label].sort(dtSort);
          // console.log('66 dok.length', dok.length);
          var curr = dok[0].val.replace(/[ a-zA-Z\*\(\)]/g, '');
          var next = dok[1].val.replace(/[ a-zA-Z\*\(\)]/g, '');
          vals[label] = isNaN(Math.round((curr-next)*100)/100) ? '--' : Math.round((curr-next)*100)/100;
        }
      }
      deltas[el.model] = vals;
      if (ind === metrics.length-1) {
        cb(deltas);
      }
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

// calculate the average of the metrics for the latest record
function average(Models, date, keys, metrics, cb) {
  // console.log('stats:94 date', date);
  // console.log('stats:95 metrics', metrics);
  var averages = [];
  date = date.setHours(0,0,0,0);
  metrics.forEach(function(el, ind, arr) {
    // console.log('stats:96 model', el.model);
    // console.log('stats:97 key', el.keys);
    var fields = el.keys.join(' ');
    Models[el.model].find({}, fields, function(err, docs) {
      // iterate over the docs (16 -- number of players)
      // iterate over the metric keys (tenyds, twnyds, etc)
      // console.log('stats:104 docs', docs);
      for (var field in el.keys) { // 3
        var label = el.keys[field];
        var vals = [];
        for (var i = 0; i < docs.length; i++) { //16
          for (var j = 0; j < docs[i][label].length; j++) {
            // select only those values that fall on that date
            // console.log('stats:112 checking dates', new Date());
            if (date === docs[i][label][j].dt.setHours(0,0,0,0) && docs[i][label][j].val.replace(/[ a-zA-Z\*\(\)]/g, '')) {
              vals.push(docs[i][label][j].val.replace(/[ a-zA-Z\*\(\)]/g, ''));
            }
          }
        }
        // console.log('stats:118 pushing averages', new Date());
        averages.push({
          date: moment(date)._d,
          label: label,
          avg: vals.length > 1 ? vals.reduce(function(pv, cu) {return +pv + +cu;})/vals.length : '--'
        });
        // console.log('stats:124 averages.length', averages.length);
      }
      if (averages.length === keys) {
        // attach the model to the averages
        // console.log('averages to wrapper:', averages);
        wrapper(metrics, averages, cb);
        }
    });
  });
}

// rearranges the object
function wrapper(metrics, averages, cb) {
  // console.log('wrapper averages', averages);
  for (var i = 0; i < metrics.length; i++) {
    for (var j = 0; j < averages.length; j++) {
      if (metrics[i].keys.indexOf(averages[j].label) != -1) {
        averages[j].model = metrics[i].model;
      }
    }
  }
  cb(metrics, averages);
}

// list out the models associated with the athlete
function filterModels(Models, cb) {
  // console.log('147 Models:', Models);
  var mods = [];
  var modNames = [];
  var keys = getKeys(Models);
  keys.forEach(function(el, ind, arr) {
      if (el != 'RecordTime' && el != 'Metric') {
        mods.push({model: el, keys: []});
        modNames.push(el);
      }
  });
  // console.log('158 mods:', mods.length);
  cb(mods, modNames);
}

// get object keys that belong only to that object
function getKeys(obj) {
  var r = [];
  for (var k in obj) {
    if (!obj.hasOwnProperty(k))
      continue;
    r.push(k);
  }
  return r;
}

// summary of model metrics
// what metrics is the model measuring?
function filterMetrics(Models, mods, modNames, cb) {
  // console.info('\n\r---------------------');
  // console.log('filterMetrics');
  // console.info('---------------------\n');

  // console.log('mods.length', mods.length);

  var notThis = ['_id', '__v', 'SID', 'MID', 'AID', 'teams'];
  var knock = [];
  // console.log('stat:170 mods', mods);
  mods.forEach(function(el, ind, arr) {
    // console.log('stats:172 model', el.model);
    // console.log('stats:173 model[el.model]', Models[el.model]);
    Models[el.model].findOne({}, function(err, doc) {
      if (err) {throw err;}
      knock.push(el.model);
      // console.log('stats:181 index', ind);
      // console.log('stats:178 doc', doc);
      for (var key in doc._doc) {
        if (notThis.indexOf(key.toString()) === -1) {
          // console.log('stats:181 key', key);
          el.keys.push(key);
        }
      }
      // console.log('185:knock.length', knock.length);
      if (knock.length === mods.length) {
        // console.log('stats: 190 pushing metrics');
        var keys = 0;
        for (var j = 0; j < mods.length; j++) {
          keys += mods[j].keys.length;
        }
        // console.log('195 keys', keys);
        // console.log('196 mods', mods);
        // console.info('\n---------------------');
        // console.info('---------------------\n');
        cb(keys, mods);
      }
    });
  });
}

function keyDiscovery() {

}
