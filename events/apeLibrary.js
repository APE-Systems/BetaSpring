;"use strict";
/*
  EVENTS: apeLibrary
 */

var ApeLibOps = require('../operations').ApeLibOps;

var ApeLibEvts = {

  createMetricCat: function(req, res, next) {
    console.log('Event: createMetricCat');

    var team = { name: req.params.team || null,
                 gender: req.params.gender || null
               };
    var mtrcat = req.params.mtrcat;
    console.log(mtrcat);
    /*
    ApeLibOps.createMetricCat(req, team, mtrcat, function(err, mtrcat) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Metric name\n", err);
          res.json(200, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(200, {error: {msg: "Metric Category name already in database", err: err}});
        } else {
          console.error("createMetricCat: Error\n", err);
          res.json(200, {
            error: {
              msg: "Problem saving metric category",
              err: err
            }
          });
        }
      } else {
        console.log('createMetricCat: Success\n');
        res.json(200, {id: mtrcat._id, name: mtrcat.name});
      }
    });
    */
  },

  createMetric: function(req, res, next) {

  },

  editMetricCat: function(req, res, next) {

  },

  editMetric: function(req, res, nect) {

  },

  deleteMetricCat: function(req, res, next) {

  },

  deleteMetric: function(req, res, next) {

  },

  // Drag'N Drop
  metricCatMetricToTeam: function(req, res, next) {

  },

  metricCatToTeam: function(req, res, next) {

  },

  metricToTeam: function(req, res, next) {

  },

}

/*
  ------ HELPER FUNCTION ------
 */








module.exports = exports = ApeLibEvts;