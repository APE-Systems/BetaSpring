;"use strict";
/*
  EVENTS: rostersPage
 */

var rospgOps = require('../operations').RostersPageOps;

var rostersPageEvts = {

  getRostersPage: function(req, res, next) {
    console.log('Event: getRostersPage');

    rospgOps.getRostersPage(req, function(err, payload) {
      if (err) {
        console.error("getRostersPage: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: ""
          }
        });
      } else {
        console.log('getRostersPage: Success');
        res.json(200, {
          nav: req.sess.school,
          athletes: payload.athletes,
          groups: payload.groups,
          apeLib: payload.apeLibPackage
        });
      }
    });
  },

  createAthlete: function(req, res, next) {
    console.log('Event: createAthlete');

    rospgOps.createAthlete(req, function(err, athlete) {
      if (err) {
        console.log("createAthlete: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.body
          }
        });
      } else {
        console.log('createAthlete: Success\n');
        res.json(201, {id: athlete._id, name: athlete.name});
      }
    });
  },

  updateAthlete: function(req, res, next) {
    console.log('Event: updateAthlete');

    rospgOps.updateAthlete(req, function(err, athlete) {
      if (err) {
        console.log("updateAthlete: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('updateAthlete: Success\n');
        res.json(200, {id: athlete._id, name: athlete.name});
      }
    });
  },

  deleteAthlete: function(req, res, next) {
    console.log('Event: deleteAthlete');

    rospgOps.deleteAthlete(req, function(err) {
      if (err) {
        console.log("deleteAthlete: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('deleteAthlete: Success');
        res.send(204);
      }
    });
  },

  createGroup: function(req, res, next) {
    console.log('Event: createGroup');

    rospgOps.createGroup(req, function(err, group) {
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

  updateGroup: function(req, res, next) {
    console.log('Event: updateGroup');

    rospgOps.updateGroup(req, function(err, group) {
      if (err) {
        console.log("updateGroup: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.oldGroup
          }
        });
      } else {
        console.log('updateGroup: Success\n');
        res.json(200, {id: group._id, name: group.name});
      }
    });
  },

  deleteGroup: function(req, res, next) {
    console.log('Event: deleteGroup');

    rospgOps.deleteGroup(req, function(err, group) {
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

  pushAthletesToGroups: function(req, res, next) {
    console.log('EVENT: pushAthletesToGroups');

    rospgOps.pushAthletesToGroups(req, function(err) {
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

  pullAthletesFromGroups: function(req, res, next) {
    console.log('EVENT: pullAthletesFromGroups');

    rospgOps.pullAthletesFromGroups(req, function(err) {
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


}

module.exports = exports = rostersPageEvts;