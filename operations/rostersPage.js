;"use strict";
/*
  OPERATIONS: rostersPage
 */

var APE = require('../models/db/config').apeMods;

var rostersPageOps = {

  getRostersPage: function(req, evtCallback) {
    console.log('Operation: getRostersPage');
    getAthletes(req, getAPElib(evtCallback));
  },

  createAthlete: function(req, callback) {
    console.log('Operation: createTeam');
    // Need to check if unique NAME for team
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

  createGroup: function(req, callback) {

  },

  updateAthlete: function(req, callback) {
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

  updateGroup: function(req, callback) {

  },

  deleteAthlete: function(req, callback) {
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
  },

  deleteGroup: function(req, callback) {

  }
};

function getAthletes(req, callback) {
  var dataLoad = {};
  var Mods = req.models;
  var school = req.school;
  var team = {
    name: req.params.team,
    gender: "men"
  };
  var username = req.username;
  var query = {school: school, team: team, 'coaches.username': username };
  var proj = {name:1, positions:1, years:1, metrics:1};

  Mods.Athletes.find(query, proj, function(err, athletes) {
    if (err) callback(err, null);
    // console.log('athletes:\n', athletes);
    dataLoad.athletes = athletes;
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

module.exports = exports = rostersPageOps;