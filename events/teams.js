;"use strict";
/*
  EVENTS: TEAMS
 */
var TeamOPS = require('../operations').Teams;

module.exports = exports = {

  getTeams: function(req, res, next) {
    console.log('getTeams event triggered');
    var school = req.params.school;
    TeamOPS.getTeams(school, function(err, teams) {
      if (err) throw new Error(err);

      console.log('Number of teams:', teams.length);
      res.json(teams);
      // res.render('teams', {
      //   // nav: teamsPage.apeLibrary.school
      //   teamsPage: teams
      // });
    });
  }
}

// Teams.createTeam
// Teams.getTeams
// Team.updateTeam
// Team.deleteTeam