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
        console.error("getRostersPage: Error\n", err);
        res.send(500, "Problem getting rosters page.");
      } else {
        // res.json(payload);
        console.log('getRostersPage: Success');
        res.json({
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
        if (err.code === 422) {
          console.error("Invalid Athlete info\n", err);
          res.json(200, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(200, {error: {msg: "Athlete already in database", err: err}});
        } else {
          console.error("createAthlete: Error\n", err);
          res.json(200, {
            error: {
              msg: "Problem saving athlete",
              err: err
            }
          });
        }
      } else {
        console.log('createAthlete: Success\n');
        res.json(200, {id: athlete._id, name: athlete.name});
      }
    });
  },

  updateAthlete: function(req, res, next) {
    console.log('Event: updateAthlete');

    rospgOps.updateAthlete(req, function(err, athlete) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Athlete info\n", err);
          res.json(422, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(422, {error: {msg: "Athlete already in database", err: err}});
        } else {
          console.error("updateAthlete: Error\n", err);
          res.json(err.code, {
            error: {
              msg: "Problem updating athlete",
              err: err
            }
          });
        }
      } else {
        console.log('updateAthlete: Success\n');
        res.json(200, {id: athlete._id, name: athlete.name});
      }
    });
  },

  deleteAthlete: function(req, res, next) {
    console.log('Event: deleteTeam');

    rospgOps.deleteTeam(req, function(err) {
      if (err) {
        console.error("deleteTeam: Error:\n", err);
        res.send(500, "Problem deleteing team");
      } else {
        console.log('deleteTeam: Success');
        res.send(200);
      }
    });
  },

  createGroup: function(req, res, next) {
    console.log('Event: createGroup');

    rospgOps.createGroup(req, function(err, group) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Group name\n", err);
          res.json(200, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(200, {error: {msg: "Group name already in database", err: err}});
        } else {
          console.error("createGroup: Error\n", err);
          res.json(200, {
            error: {
              msg: "Problem saving group",
              err: err
            }
          });
        }
      } else {
        console.log('createGroup: Success\n');
        res.json(200, {id: group._id, name: group.name});
      }
    });
  },

  updateGroup: function(req, res, next) {
    console.log('Event: updateGroup');

    rospgOps.updateGroup(req, function(err, group) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Group name\n", err);
          res.json(200, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(200, {error: {msg: "Group name already in database", err: err}});
        } else {
          console.error("updateGroup: Error\n", err);
          res.json(200, {
            error: {
              msg: "Problem saving group",
              err: err
            }
          });
        }
      } else {
        console.log('createGroup: Success\n');
        res.json(200, {id: group._id, name: group.name});
      }
    });
  },

  deleteGroup: function(req, res, next) {
    console.log('Event: deleteGroup');

    rospgOps.deleteGroup(req, function(err, group) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Group name\n", err);
          res.json(200, {error: err});
        } else {
          console.error("deleteGroup: Error\n", err);
          res.json(200, {
            error: {
              msg: "Problem deleting group",
              err: err
            }
          });
        }
      } else {
        console.log('deleteGroup: Success\n');
        res.json(200, {id: group._id, name: group.name});
      }
    });
  }

}

module.exports = exports = rostersPageEvts;