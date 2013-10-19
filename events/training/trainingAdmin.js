;"use strict";
/*
  EVENTS: trainingAdmin
 */

var trnadmOps = require('../../operations').TrainingAdminOps;

var trainingAdminEvts = {

  getTrainingAdmin: function(req, res, next) {
    console.log('Event: getTrainingAdmin');

    trnadmOps.getTrainingAdmin(req, function(err, payload) {
      if (err) {
        console.error("getTrainingAdmin: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: {
              team: req.params.team,
              gender: req.params.gender
            }
          }
        });
      } else {
        console.log('getTrainingAdmin: Success');
        res.json(200, {
          nav: req.sess.school,
          metricCat: payload.mtrcats,
          apeLib: payload.apeLibPackage
        });
      }
    });
  },

  createMetricCat: function(req, res, next) {
    console.log('Event: createMetricCat');

    trnadmOps.createMetricCat(req, function(err, mcat) {
      if (err) {
        console.log("createMetricCat: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.body
          }
        });
      } else {
        console.log('createMetricCat: Success\n');
        res.json(201, {
          id: mcat._id,
          name: mcat.name
        });
      }
    });
  },

  updateMetricCat: function(req, res, next) {
    console.log('Event: updateMetricCat');

    trnadmOps.updateMetricCat(req, function(err, mcat) {
      if (err) {
        console.log("\nupdateMetricCat: Error\n", err.name + '\n code: ' + err.code);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('updateMetricCat: Success');
        res.json(200, {_id: mcat.id, name: mcat.name});
      }
    });
  },

  deleteMetricCat: function(req, res, next) {
    console.log('Event: deleteMetricCat');

    trnadmOps.deleteMetricCat(req, function(err) {
      if (err) {
        console.log("deleteMetricCat: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.oldGroup
          }
        });
      } else {
        console.log('deleteMetricCat: Success\n');
        res.send(204);
      }
    });
  },

  createMetric: function(req, res, next) {
    console.log('Event: createMetric');

    trnadmOps.createMetric(req, function(err, mtr) {
      if (err) {
        console.log("createMetric: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.body
          }
        });
      } else {
        console.log('createMetric: Success\n');
        res.json(200, {
          id: mtr._id,
          name: mtr.name,
          meta: mtr.meta
        });
      }
    });
  },

  updateMetric: function(req, res, next) {
    console.log('Event: updateMetric');

    trnadmOps.updateMetric(req, function(err, metric) {
      if (err) {
        console.log("updateMetric: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.group
          }
        });
      } else {
        console.log('updateMetric: Success\n');
        res.json(200, {id: metric._id, name: metric.name});
      }
    });
  },

  deleteMetric: function(req, res, next) {
    console.log('Event: deleteMetric');

    trnadmOps.deleteMetric(req, function(err, group) {
      if (err) {
        console.log("deleteMetric: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.group
          }
        });
      } else {
        console.log('deleteMetric: Success\n');
        res.send(204);
      }
    });
  },

  //NOTE:
  //  the following functions are not active
  //  the create/update/delete of a metric by default
  //  pushes and pulls into/from the models
  //TODO:
  //  create/update/delete a metric without needing
  //  to have a parent
  pushMetricToMCat: function(req, res, next) {
    console.log('EVENT: pushMetricToMCats');

    trnadmOps.pushMetricToMCats(req, function(err, metric) {
      if (err) {
        console.log("pushMetricToMCats: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('pushMetricToMCats: Success\n');
        res.json({
          _id: metric._id,
          catName: metric.mtrcats.name,
          mtrName: metric.name
        });
      }
    });
  },

  pullMetricFromMCat: function(req, res, next) {
    console.log('EVENT: pullAthletesFromGroups');

    trnadmOps.pullAthletesFromGroups(req, function(err) {
      if (err) {
        console.log("pullAthletesFromGroups: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('pullAthletesFromGroups: Success\n');
        res.send(204);
      }
    });
  }

};//END

module.exports = exports = trainingAdminEvts;