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
      }
      console.log('createTeam: Success');
      res.send(200);
    })
  }

}








module.exports = exports = teamsPageEvts;