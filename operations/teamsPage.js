;"use strict";
/*
  OPERATIONS: teamsPage
 */

var APE = require('../models/db/config').apeMods;

var teamsPageOps = {

  getTeamsPage: function(req, callback) {
    var Mods = req.models;
    var school = req.school;
    Mods.Teams.find({school: school}, {name:1}, function(err, teams) {
      if (err) return callback(err, null);

      callback(null, teams);
      return;
    });
  },

  createTeam: function(req, callback) {
    var Mods = req.models;
    var school = req.school;
    var newTeam = new Mods.Teams();

    newTeam.createdBy = req.username;
    newTeam.coaches.push({name: "coach name", username: req.username});
    newTeam.school = school;
    newTeam.name = req.body.name;
    newTeam.gender = req.body.gender;

    newTeam.save(function(err) {
      callback(err);
    });
  }
}

function getTeams(req, callback) {
  var query = {school: school, 'coaches.username': req.username};
  var proj = {name:1, gender:1, mtrcats:1, metrics:1};
  Mods.Teams.find(query, proj, callback);
}

function getAPElib(req, callback) {
  APE.mtrcats.
}







module.exports = exports = teamsPageOps;



