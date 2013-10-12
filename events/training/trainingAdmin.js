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

  updateMetric: function(req, res, next) {
    console.log('Event: createGroup');

    trnadmOps.createGroup(req, function(err, group) {
      if (err) {
        console.log("createGroup: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.group
          }
        });
      } else {
        console.log('createGroup: Success\n');
        res.json(201, {id: group._id, name: group.name});
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

  deleteMetric: function(req, res, next) {
    console.log('Event: deleteGroup');

    trnadmOps.deleteGroup(req, function(err, group) {
      if (err) {
        console.log("deleteGroup: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.group
          }
        });
      } else {
        console.log('deleteGroup: Success\n');
        res.send(204);
      }
    });
  },

  pushMetricToMCat: function(req, res, next) {
    console.log('EVENT: pushAthletesToGroups');

    trnadmOps.pushAthletesToGroups(req, function(err) {
      if (err) {
        console.log("pushAthletesToGroups: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('pushAthletesToGroups: Success\n');
        res.send(204);
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