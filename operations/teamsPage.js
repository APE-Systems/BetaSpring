;"use strict";
/*
  OPERATIONS: teamsPage
 */

var APE = require('../models/db/config').apeMods;

var teamsPageOps = {

  getTeamsPage: function(req, evtCallback) {
    console.log('Operation: getTeamsPage');
    getTeams(req, getAPElib(evtCallback));
  },

  createTeam: function(req, callback) {
    console.log('Operation: createTeam');
    // Need to check if unique NAME for team
    var Mods = req.models;
    var school = req.sess.school;
    var newTeam = new Mods.Teams();

    newTeam.createdBy = req.sess.COID;
    newTeam.coaches.push({name: "coach name", username: req.sess.username});
    newTeam.school = school;
    newTeam.name = req.params.team;
    newTeam.gender = req.params.gender;

    console.log(newTeam);
    newTeam.save(function(err) {
      callback(err, newTeam);
    });
  },

  updateTeam: function(req, callback) {
    console.log('Operation: updateTeam');
    var Mods = req.models;
    var school = req.school;

    var cond = {name: req.params.team};
    var update = {
      name: req.body.name,
      gender: req.body.gender
    };
    Mods.Teams.findOneAndUpdate(cond, update, function(err, updated) {
      if (err) callback(err);

      console.log('teamUpdate:', update);
      callback(null);
    });

  },

  deleteTeam: function(req, callback) {
    console.log('Operation: deleteTeam');
    var Mods = req.models;
    var school = req.school;

    //TODO:
    //  check to see if athletes are following this team
    //  if so, then report back before deleting
    Mods.Teams.findOneAndRemove(cond, function(err, deldoc) {
      if (err) callback(err);

      console.log('teamDelete:', deldoc);
      callback(null);
    });
  }
}

function getTeams(req, callback) {
  var dataLoad = {};
  var Mods = req.models;
  var school = req.sess.school;
  var username = req.sess.username;
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