;"use strict";
/*
  OPERATIONS: teamsPage
 */

var APE = require('../models/db/config').apeMods;

var teamsPageOps = {

  getTeamsPage: function(req, evtCallback) {

    getTeams(req, getAPElib(evtCallback));

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
  },

  updateTeam: function(req, callback) {
    console.log('Operation: updateTeam');
  },

  deleteTeam: function(req, callback) {
    console.log('Operation: deleteTeam');
  }
}

function getTeams(req, callback) {
  var dataLoad = {};
  var Mods = req.models;
  var school = req.school;
  var username = req.username;
  var query = {school: school, 'coaches.username': username};
  var proj = {name:1, gender:1, mtrcats:1, metrics:1};

  Mods.Teams.find(query, proj, function(err, teams) {
    if (err) callback(err, null);
    dataLoad.teams = teams;
    callback(dataLoad);
  });
}

function getAPElib(evtCallback) {
  return function(dataLoad) {
    var apeLibPackage = {};
    var query = {};
    var proj = {name:1, metrics:1};
    APE.mtrcats.find(query, proj, function(err, mcs) {
      if (err) evtCallback(err, null);

      apeLibPackage.mtrcats = mcs;
      APE.metrics.find({"mtrcats.name": {$exists: false}}, {name:1}, function(err, mtrs) {
        if (err) evtCallback(err, null);

        apeLibPackage.metrics = mtrs;
        // console.log('apeLibPackage:\n', apeLibPackage);
        dataLoad.apeLibPackage = apeLibPackage;
        // console.log('dataLoad\n', dataLoad);
        return evtCallback(null, dataLoad);
      });
    });
  };
}

module.exports = exports = teamsPageOps;



