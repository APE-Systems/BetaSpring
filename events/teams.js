;"use strict";
/*
  EVENTS: TEAMS
 */

var teamOPS = require('../operations').Teams;

var teamEvents = {

  getTeams: function(req, res, next) {
    console.log('getTeams event triggered');

    teamOPS.getTeams(req, function(err, teams) {
      if (err) throw new Error(err);

      console.log('Number of teams:', teams.length);
      res.json(teams);
      // res.render('teams', {
      //   // nav: teamsPage.apeLibrary.school
      //   teamsPage: teams
      // });
    });
  },

  createTeam: function(req, res, next) {

  },
  updateTeam: function(req, res, next) {

  },
  deleteTeam: function(req, res, next) {

  }
}

module.exports = exports = teamEvents;