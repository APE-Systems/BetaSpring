;"use strict";
/*
  OPERATIONS: rostersPage
 */

var APE = require('../models/db/config').apeMods;

var rostersPageOps = {

  getRostersPage: function(req, evtCallback) {
    console.log('Operation: getRostersPage');

    var pgload = {}
    var dataLoad = {};

    pgload.Mods = req.models;
    pgload.sess = req.sess;
    pgload.team = {
      name: req.params.team,
      gender: req.params.gender
    };

    getAthletesAndGroups(pgload);
    return;

    function getAthletesAndGroups(pgload) {
      var query = {school: pgload.sess.school, name: pgload.team.name, gender: pgload.team.gender};
      var proj = {athletes:1, groups:1};

      pgload.Mods.Teams.findOne(query, proj, function(err, team) {
        if (err) return evtCallback(err, null);
        console.log('team.athletes:', team.athletes.length);
        console.log('team.groups:', team.groups.length);

        dataLoad.athletes = team.athletes;
        dataLoad.groups = team.groups;
        getAPElib(pgload);
        return;
      });
    }

    function getAPElib(pgload) {
      var apeLibPackage = {};
      var query = {};
      var proj = {name:1, metrics:1};
      APE.MetricCats.find(query, proj, function(err, mcs) {
        if (err) return evtCallback(err, null);

        apeLibPackage.mtrcats = mcs;
        APE.Metrics.find({"mtrcats.name": {$exists: false}}, {name:1}, function(err, mtrs) {
          if (err) return evtCallback(err, null);

          apeLibPackage.metrics = mtrs;
          // console.log('apeLibPackage:\n', apeLibPackage);
          dataLoad.apeLibPackage = apeLibPackage;
          // console.log('dataLoad\n', dataLoad);
          
          evtCallback(null, dataLoad);
          return;
        });
      });
    };
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

      var newGroup = {
        name: req.params.group,
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models
      };
      var crGroup = new newGroup.Mods.Groups();

      crGroup.createdBy = newGroup.sess.COID;
      crGroup.school = newGroup.sess.school;
      crGroup.team = newGroup.team;
      crGroup.name = newGroup.name;

      console.log('create ', crGroup.name);
      crGroup.save(function(err) {
        if (err) return callback(err, null);
        console.log("crGroup:", crGroup.name);

        newGroup.doc = crGroup;
        propagateGroupCreate(newGroup, callback);
      });
    }
  },

  updateGroup: function(req, callback) {
    console.log('Operation: updateGroup');
    //who follows groups? Teams, Athletes, mtrcats, metrics

    validateInput(req.params.oldGroup, updateGroup);

    function updateGroup(err, group) {
      if (err) return callback(err, null);

      var upGroup = {
        newGroup: req.body.upName,
        oldGroup: req.params.oldGroup,
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models
      };

      console.log('replace ' + upGroup.oldGroup + ' with ' + upGroup.newGroup);
      var cond = {school: upGroup.sess.school, team: upGroup.team, name: upGroup.oldGroup};
      var update = {$set: {name: upGroup.newGroup}};

      upGroup.Mods.Groups.findOneAndUpdate(cond, update, function(err, group) {
        if (err) return callback(err, null);
      console.log('upGroup:\n', group.name);

      upGroup.doc = group;
      propagateGroupUpdate(upGroup, callback);
      });
    }
  },

  deleteGroup: function(req, callback) {
    console.log('Operation: deleteGroup');

    validateInput(req.params.group, deleteGroup);

    function deleteGroup(err, group) {
      if (err) return callback(err, null);

      var delGroup = {
        name: req.params.group,
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models
      };

      console.log('delete ' + delGroup.name);
      var cond = {school: delGroup.sess.school, team: delGroup.team, name: delGroup.name};

      delGroup.Mods.Groups.findOneAndRemove(cond, function(err, group) {
        if (err) return callback(err, null);
      console.log('delGroup:\n', group);

      delGroup.doc = group;
      propagateGroupDelete(delGroup, callback);
      });
    }
  }
};

/*
  ------ HELPER FUNCTIONS ------findOneAndUpdate
 */

function propagateGroupDelete(delGroup, callback) {
  console.info('propagating delGroup');
  deleteCoachGroup(delGroup);

  function deleteCoachGroup(delGroup) {
    console.log('deleteCoachGroup');

    //TODO:
    //  delete a single coach group rather all coaches?
    var cond = {school: delGroup.sess.school, "groups.name": delGroup.name};
    var update = {$pull: {groups: {name: delGroup.name}}};
    delGroup.Mods.Coaches.update(cond, update, function(err, numUp) {
      if (err) return callback(err, null);
      console.log('coach:\n', numUp);

      deleteTeamGroup(delGroup);
      return;
    });
  }

  function deleteTeamGroup(delGroup) {
    console.log('deleteTeamGroup');

    var cond = {school: delGroup.sess.school, name: delGroup.team.name, gender: delGroup.team.gender, "groups.name": delGroup.name};
    var update = {$pull: {groups: {name: delGroup.name}}};
    delGroup.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return callback(err, null);
      console.log('team:\n', numUp);

      deleteAthleteGroup(delGroup);
      return;
    });
  }

  function deleteAthleteGroup(delGroup) {
    console.log('deleteAthleteGroup');

    var cond = {school: delGroup.sess.school, team: delGroup.team, "groups.name": delGroup.name};
    var update = {$pull: {groups: {name: delGroup.name}}};
    delGroup.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return callback(err, null);
      console.log('athlete:\n', numUp);

      return callback(null, delGroup.doc);
    });
  }
}

function propagateGroupUpdate(upGroup, callback) {
  console.info('propagating upGroup');
  updateCoachGroup(upGroup);

  function updateCoachGroup(upGroup) {
    console.log('updateCoachGroup');

    var cond = {school: upGroup.sess.school, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Coaches.findOneAndUpdate(cond, update, function(err, coach) {
      if (err) return callback(err, null);
      console.log('coaches:\n', coach.groups);

      updateTeamGroup(upGroup);
    });
  }

  function updateTeamGroup(upGroup) {
    console.log('updateTeamGroup');

    var cond = {school: upGroup.sess.school, name: upGroup.team.name, gender: upGroup.team.gender, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return callback(err, null);
      console.log('team:\n', team.groups);

      updateAthleteGroup(upGroup);
    });
  }

  function updateAthleteGroup(upGroup) {
    console.log('updateAthleteGroup');

    var cond = {school: upGroup.sess.school, "coaches.username": upGroup.sess.username, "coaches.name": upGroup.sess.name, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Athletes.update(cond, update, {multi: true}, function(err, numUp) {
      if (err) return callback(err, null);
      console.log('athletes:', numUp);

      callback(null, upGroup.doc);
    });
  }
}

function propagateGroupCreate(newGroup, callback) {
  console.info('propagating newGroup');
  return insertCoachGroup(newGroup);

  function insertCoachGroup(newGroup) {
    console.log('insertCoachGroup');

    var cond = {school: newGroup.sess.school, username: newGroup.sess.username, "teams.name": newGroup.team.name, "teams.gender": newGroup.team.gender};
    var update = {$push: {groups: {_id: newGroup.doc._id, name: newGroup.doc.name}}};
    newGroup.Mods.Coaches.findOneAndUpdate(cond, update, function(err, coach) {
      if (err) return callback(err, null);
      console.log('coach:\n', coach.groups);

      return insertTeamGroup(newGroup);
    });
  }

  function insertTeamGroup(newGroup) {
    console.log("insertTeamGroup");

    var cond = {school: newGroup.sess.school, name: newGroup.team.name, gender: newGroup.team.gender};
    var update = {$push: {groups: {_id: newGroup.doc._id, name: newGroup.doc.name}}};
    newGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return callback(err, null);
      console.log('team:\n', team.groups);

      return callback(null, newGroup.doc);
    });
  }
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

module.exports = exports = rostersPageOps;