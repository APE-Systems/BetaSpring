;"use strict";
/*
  OPERATIONS: TEAMS
 */

var TeamOPS = {

  getTeams: function(req, callback) {
    var Mods = req.models;
    var school = req.school;
    Mods.Teams.find({school: school}, {name:1}, function(err, teams) {
      if (err) return callback(err, null);

      callback(null, teams);
      return;
    });
  }
}

module.exports = exports = TeamOPS;



// module.exports = exports = {

//   getTeams: function(school, callback) {

//     Teams.find({school: school}, {name:1}, function(err, teams) {
//       if (err) return callback(err, null);

//       callback(null, teams);
//     });
//   }
// }