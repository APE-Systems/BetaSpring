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
        console.error("getTeamsPage: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: ""
          }
        });
      } else {
        // console.log('payLoad:', payLoad);
        res.json(200, {
          nav: req.sess.school,
          teams: payLoad.teams,
          apeLib: payLoad.apeLibPackage
        });
      }
    });
  },

  //AJAX
  createTeam: function(req, res, next) {
    console.log('Event: createTeam');

    tmspgOps.createTeam(req, function(err, team) {
      if (err) {
        console.log("createTeam: Error\n", err.name);
        var val = {team: req.params.team, gender: req.params.gender};
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: val
          }
        });
      } else {
        console.log('createTeam: Success\n');
        res.json(201, {id: team._id, name: team.name, gender: team.gender});
      }
    });
  },

  //AJAX
  updateTeam: function(req, res, next) {
    console.log('Event: updateTeam');

    tmspgOps.updateTeam(req, function(err, team) {
      if (err) {
        console.log("updateTeam: Error\n", err.name);
        var val = {team: req.params.team, gender: req.params.gender};
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: val
          }
        });
      } else {
        console.log('updateTeam: Success');
        res.json(200, {_id: team._id, name: team.name, gender: team.gender});
      }
    });
  },

  //AJAX
  deleteTeam: function(req, res, next) {
    console.log('Event: deleteTeam');

    tmspgOps.deleteTeam(req, function(err) {
      if (err) {
        console.log("deleteTeam: Error\n", err.name);
        var val = {team: req.params.team, gender: req.params.gender};
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: val
          }
        });
      } else {
        console.log('deleteTeam: Success');
        res.send(204);
      }
    });
  }

}

module.exports = exports = teamsPageEvts;