;"use strict";
/*
  EVENTS: teamsPage
 */

var tmspgOps = require('../operations').TeamsPageOps;

var teamsPageEvts = {

  getTeamsPage: function(req, res, next) {
    console.log('Event: getTeamsPage');

    tmspgOps.getTeamsPage(req, function(err, payLoad) {
      if (err) throw new Error(err);

      // console.log('payLoad:', payLoad);
      res.render('teamsPage', {
        nav: req.school,
        teams: payLoad.teams,
        apeLib: payLoad.apeLibPackage
      });
    });
  },

  createTeam: function(req, res, next) {
    console.log('Event: createTeam');

    tmspgOps.createTeam(req, function(err) {
      if (err) {
        console.error("createTeam: Error\n", err);
        res.send(500, "Problem saving team");
      } else {
        console.log('createTeam: Success');
        res.json(200, {"_id": "abracadabra"});
      }
    })
  },

  updateTeam: function(req, res, next) {
    console.log('Event: updateTeam');

    tmspgOps.updateTeam(req, function(err) {
      if (err) {
        console.error("updateTeam: Error:\n", err);
        res.send(500, "Problem updating team");
      } else {
        console.log('updateTeam: Success');
        res.send(200);
      }
    });
  },

  deleteTeam: function(req, res, next) {
    console.log('Event: deleteTeam');

    tmspgOps.deleteTeam(req, function(err) {
      if (err) {
        console.error("deleteTeam: Error:\n", err);
        res.send(500, "Problem deleteing team");
      } else {
        console.log('deleteTeam: Success');
        res.send(200);
      }
    });
  }

}

module.exports = exports = teamsPageEvts;