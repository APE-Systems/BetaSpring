;"use strict";
/*
  OPERATIONS: TEAMS
 */
var mongoose = require('mongoose')
  , ape, Teams;
ape = mongoose.createConnection("mongodb://localhost:27017/ape?safe=true");
Teams = ape.model('teams', require('../models/schemas/teams'));

module.exports = exports = {

  getTeams: function(school, callback) {

    Teams.find({school: school}, {name:1}, function(err, teams) {
      if (err) return callback(err, null);

      console.log("Found " + teams.length + " teams");
      callback(null, teams);
    });
  }
}