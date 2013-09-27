;"use strict";
/*
  EVENTS: rostersPage
 */

var rospgOps = require('../operations').RostersPageOps;

var rostersPageEvts = {

  getRostersPage: function(req, res, next) {
    console.log('Event: getRostersPage');

    rospgOps.getRostersPage(req, function(err, payLoad) {
      if (err) throw new Error(err);

      // console.log('payLoad:', payLoad);
      res.render('rostersPage', {
        nav: req.school,
        athletes: payLoad.athletes,
        apeLib: payLoad.apeLibPackage
      });
    });
  },

  createAthlete: function(req, res, next) {
    console.log('Event: createAthlete');

    rospgOps.createAthlete(req, function(err, athlete) {
      if (err) {
        console.error("createAthlete: Error\n", err);
        res.send(500, "Problem saving athlete");
      } else {
        console.log('createAthlete: Success');
        res.send(200);
      }
    })
  },

  updateAthlete: function(req, res, next) {
    console.log('Event: updateTeam');

    rospgOps.updateTeam(req, function(err) {
      if (err) {
        console.error("updateTeam: Error:\n", err);
        res.send(500, "Problem updating team");
      } else {
        console.log('updateTeam: Success');
        res.send(200);
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