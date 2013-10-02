;"use strict";
/*
  EVENTS: teamsPage
 */

var tmspgOps = require('../operations').TeamsPageOps;

var teamsPageEvts = {

  getTeamsPage: function(req, res, next) {
    console.log('Event: getTeamsPage');

    tmspgOps.getTeamsPage(req, function(err, payLoad) {
      if (err) {
        console.error("getTeamsPage: Error\n", err);
        res.send(500, "Problem getting rosters page.");
      } else {
        // console.log('payLoad:', payLoad);
        res.json(200, {
          nav: req.sess.school,
          teams: payLoad.teams,
          apeLib: payLoad.apeLibPackage
      });
    });
  },

  //AJAX
  createTeam: function(req, res, next) {
    console.log('Event: createTeam');

    tmspgOps.createTeam(req, function(err, team) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Team name\n", err);
          res.json(422, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(409, {error: {msg: "Team name already in database", err: err}});
        } else {
          console.error("createTeam: Error\n", err);
          res.json(500, {
            error: {
              msg: "Problem saving team",
              err: err
            }
          });
        }
      } else {
        console.log('createTeam: Success\n');
        res.json(201, {id: team._id, name: team.name, gender: team.gender});
      }
    })
  },

  //AJAX
  updateTeam: function(req, res, next) {
    console.log('Event: updateTeam');

    tmspgOps.updateTeam(req, function(err) {
      if (err) {
        if (err.code === 422) {
          console.error("Invalid Team name\n", err);
          res.json(422, {error: err});
        } else if (err.code === 11000) {
          console.error("duplicate key\n", err);
          res.json(409, {error: {msg: "Team already in database", err: err}});
        } else {
          console.error("updateTeam: Error\n", err);
          res.json({
            status: 500,
            error: {
              Msg: "Problem updating team",
              err: err
            }
          });
        }
      } else {
        console.log('updateTeam: Success');
        res.json(200, {status: "success"});
      }
    });
  },

  //AJAX
  deleteTeam: function(req, res, next) {
    console.log('Event: deleteTeam');

    tmspgOps.updateTeam(req, function(err) {
      if (err) {
        if (err.code === 404) {
        console.info("Group not found\n", err);
        res.json(404, {error: err});
        } else {
          console.error("deleteTeam: Error\n", err);
          res.json({
            status: 500, 
            error: {
              Msg: "Problem deleting team",
              err: err
            }
          });
        }
      } else {
        console.log('deleteTeam: Success');
        res.send(204);
      }
    });
  }

}

module.exports = exports = teamsPageEvts;