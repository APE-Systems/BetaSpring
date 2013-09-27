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
    console.log('Operation: createAthlete');

    var team = {name: req.params.team, gender: req.params.gender};
    var school = req.school;
    var Mods = req.models;
    var newAthlete = new Mods.Athletes();

    newAthlete.createdBy = req.sess.COID;
    newAthlete.school = school;
    newAthlete.name = req.body.name;
    newAthlete.gender = req.body.gender;

    newAthlete.save(function(err) {
      callback(err);
    });
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

  createGroup: function(req, callback) {
    console.log('Operation: createGroup');

    validateInput(req.params.group, insertGroup);

    function insertGroup(err, group) {
      if (err) return callback(err, null);

      var team = {name: req.params.team, gender: req.params.gender};
      var group = req.params.group;
      var school = req.sess.school;
      var Mods = req.models;
      var newGroup = new Mods.Groups();

      newGroup.createdBy = req.sess.COID;
      newGroup.school = school;
      newGroup.team = team;
      newGroup.name = group;

      // console.log('newGroup\n', newGroup);
      newGroup.save(function(err) {
        if (err) return callback(err, null);

        console.log("Group saved");
        insertTeamGroup(req, newGroup, function(err, numUp) {
          if (err) return callback(err, null);

          console.log('Team updated with group', numUp);
          return callback(null, newGroup);
        });
      });
    }
  },

  updateGroup: function(req, callback) {
    console.log('Operation: createGroup');
    //who follows groups? Teams, Athletes, mtrcats, metrics

    validateInput(req.params.oldGroup, updateGroup);

    function updateGroup(err, group) {
      if (err) return callback(err, null);

      var upGroup = {
        newGroup: req.body.name,
        oldGroup: req.params.oldGroup,
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models
      };

      console.log('replace ' + upGroup.oldGroup + ' with ' + upGroup.newGroup);
      var cond = {school: upGroup.sess.school, team: upGroup.team, name: upGroup.oldGroup};
      var update = {$set: {name: upGroup.newGroup}};

      upGroup.Mods.Groups.findOneAndUpdate(cond, update, function(err, group) {
        if (err) callback(err, null);
      console.log('newGroup:\n', group);

      upGroup.doc = group;
      propagateGroupUpdate(upGroup, callback);
      });
    }
  },

  deleteGroup: function(req, callback) {

  }
};

/*
  ------ HELPER FUNCTIONS ------findOneAndUpdate
 */

function propagateGroupUpdate(upGroup, callback) {
  // return function(err, numUp) {
    // if (err) return callback(err, null);

    console.info('propagating group');
    updateCoachGroup(upGroup, updateTeamGroup)

    function updateCoachGroup(upGroup, updateTeamGroup) {
      console.log('updateCoachGroup');
      var cond = {school: upGroup.sess.school, "groups.name": upGroup.oldGroup};
      var update = {$set: {groups: {name: upGroup.newGroup}}};
      upGroup.Mods.Coaches.update(cond, update, function(err, coach) {
        if (err) return callback(err, null);
        console.log('coach:\n', coach.groups);

        updateTeamGroup(upGroup);
      });
    }

    function updateTeamGroup(upGroup) {
      console.log('updateTeamGroup');

      var cond = {school: upGroup.sess.school, name: upGroup.team.name, gender: upGroup.team.gender, "groups.name": upGroup.oldGroup};
      var update = {$set: {groups: {name: upGroup.newGroup}}};
      upGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
        if (err) return callback(err, null);
        console.log('team:\n', team.groups);

        updateAthleteGroup(upGroup);
      });
    }

    function updateAthleteGroup(upGroup) {
      console.log('updateAthleteGroup');

      var cond = {school: upGroup.sess.school, "coaches.username": upGroup.sess.username, "coaches.name": upGroup.sess.name, "groups.name": upGroup.oldGroup};
      var update = {$set: {groups: {name: upGroup.newGroup}}};
      upGroup.Mods.Athletes.update(cond, update, {multi: true}, function(err, numUp) {
        if (err) return callback(err, null);
        console.log('athletes:', numUp);

        callback(null, upGroup.doc);
      });
    }

  // }
}

function insertTeamGroup(req, group, callback) {
  console.log("inserting group into team");
  var Mods = req.models;
  var query = {school: group.school, name: group.team.name, gender: group.team.gender};
  var update = {$push: {groups: {_id: group._id, name: group.name}}}
  Mods.Teams.update(query, update, {multi:true}, callback);
  return;
}

function validateInput(input, callback) {
  console.log('Operations: validateInput');
  var maxCharLen = 45;
  var rego = /^[_]*[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/;
  if (maxCharLen === input.length) {
    console.info("Validation: Error\n");
    var err = {name: "ValidationError", msg: 'Input exceeds number of characaters allowed', code: 422};
    return callback(err, null);
  }
  if (!rego.test(input)) {
    console.info("Validation: Error\n");
    var err = {name: "ValidationError", msg: 'Not valid input', code: 422};
    return callback(err, null);
  }
  console.info("Validation: Success\n");
  return callback(null, input);
}

function getAthletes(req, callback) {
  var dataLoad = {};
  var Mods = req.models;
  var school = req.sess.school;
  var team = {
    name: req.params.team,
    gender: req.params.gender
  };
  var username = req.sess.username;
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
    APE.MetricCats.find(query, proj, function(err, mcs) {
      if (err) evtCallback(err, null);

      apeLibPackage.mtrcats = mcs;
      APE.Metrics.find({"mtrcats.name": {$exists: false}}, {name:1}, function(err, mtrs) {
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