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

  createAthlete: function(req, evtCallback) {
    console.log('Operation: createAthlete');
    var athlete = {
      fname: req.body.fname,
      lname: req.body.lname,
      height: req.body.height,
      position: req.body.position,
      year: req.body.year,
      city: req.body.city,
      state: req.body.state
    };

    validateAthleteInput(athlete, forgeAthlete);

    function forgeAthlete(err, athlete) {
      if (err) return evtCallback(err, null);

      var crAthlete = {
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models
      };
      var newAthlete = new crAthlete.Mods.Athletes();

      newAthlete.createdBy = req.sess.COID;
      newAthlete.school = crAthlete.sess.school;
      newAthlete.team = crAthlete.team;

      newAthlete.name = athlete.fname + ' ' + athlete.lname;
      newAthlete.username = athlete.username + crAthlete.sess.webdom;
      newAthlete.positions.push(athlete.position);
      newAthlete.years.push(athlete.year);
      newAthlete.hometown = athlete.city + ', ' + athlete.state;
      newAthlete.height = athlete.height;
      newAthlete.coaches.push({
        username: crAthlete.sess.username,
        name: crAthlete.sess.name,
        _id: crAthlete.sess.COID
      });

      // console.log('newAthlete:\n', newAthlete);
      // return evtCallback(null, newAthlete);
      newAthlete.save(function(err) {
        if (err) return evtCallback(err, null);
        console.log('Athlete saved:', newAthlete.name);

        crAthlete.athlete = newAthlete;
        return propagateAthleteCreate(crAthlete, evtCallback);
      });
    }
  },

  updateAthlete: function(req, evtCallback) {
    console.log('Operation: updateTeam');
    var Mods = req.models;
    var school = req.school;

    var cond = {name: req.params.team};
    var update = {
      name: req.body.name,
      gender: req.body.gender
    };
    Mods.Teams.findOneAndUpdate(cond, update, function(err, updated) {
      if (err) evtCallback(err);

      console.log('teamUpdate:', update);
      evtCallback(null);
    });

  },

  deleteAthlete: function(req, evtCallback) {
    console.log('Operation: deleteTeam');
    var Mods = req.models;
    var school = req.school;

    //TODO:
    //  check to see if athletes are following this team
    //  if so, then report back before deleting
    Mods.Teams.findOneAndRemove(cond, function(err, deldoc) {
      if (err) evtCallback(err);

      console.log('teamDelete:', deldoc);
      evtCallback(null);
    });
  },

  createGroup: function(req, evtCallback) {
    console.log('Operation: createGroup');

    validateInput(req.params.group, insertGroup);

    function insertGroup(err, group) {
      if (err) return evtCallback(err, null);

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
        if (err) return evtCallback(err, null);
        console.log("Group saved:", crGroup.name);

        newGroup.doc = crGroup;
        propagateGroupCreate(newGroup, evtCallback);
      });
    }
  },

  updateGroup: function(req, evtCallback) {
    console.log('Operation: updateGroup');
    //who follows groups? Teams, Athletes, mtrcats, metrics

    validateInput(req.params.oldGroup, updateGroup);

    function updateGroup(err, group) {
      if (err) return evtCallback(err, null);

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
        if (err) return evtCallback(err, null);
      console.log('upGroup:\n', group.name);

      upGroup.doc = group;
      propagateGroupUpdate(upGroup, evtCallback);
      });
    }
  },

  deleteGroup: function(req, evtCallback) {
    console.log('Operation: deleteGroup');

    validateInput(req.params.group, deleteGroup);

    function deleteGroup(err, group) {
      if (err) return evtCallback(err, null);

      var delGroup = {
        name: req.params.group,
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models,
        update: {$pull: {groups: {name: group}}}
      };

      console.log('delete ' + delGroup.name);
      var cond = {school: delGroup.sess.school, team: delGroup.team, name: delGroup.name};

      delGroup.Mods.Groups.findOneAndRemove(cond, function(err, group) {
        if (err) return evtCallback(err, null);
      console.log('delGroup:\n', group);

      delGroup.doc = group;
      propagateGroupDelete(delGroup, evtCallback);
      });
    }
  }
};

/*
  ------ HELPER FUNCTIONS ------
 */

// ---- ATHLETE ---- //

function propagateAthleteCreate(crAthlete, evtCallback) {
  console.info('propagating crAthlete');
  return insertSchoolAthlete(crAthlete);

  function insertSchoolAthlete(crAthlete) {
    console.log('insertSchoolAthlete');

    var cond = {name: crAthlete.sess.school, "coaches.username": crAthlete.sess.username, "teams.name": crAthlete.team.name, "teams.gender": crAthlete.team.gender};
    var update = {$push: {athletes: {_id: crAthlete.athlete._id, name: crAthlete.athlete.name}}};
    // APE.Schools.findOne(cond, function(err, numUp) {
    APE.Schools.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(err, null);
      console.log('school:\n', numUp);

      // return evtCallback(null, crAthlete.athlete);
      return insertCoachAthlete(crAthlete);
    });
  }

  function insertCoachAthlete(crAthlete) {
    console.log('insertCoachAthlete');
    //TODO:
    //  a single coach or all coaches?
    var cond = {school: crAthlete.sess.school, 'teams.name': crAthlete.team.name, 'teams.gender': crAthlete.team.gender};
    var update = {$push: {athletes: {_id: crAthlete.athlete._id, name: crAthlete.athlete.name}}};
    // crAthlete.Mods.Coaches.findOne(cond, function(err, numUp) {
    crAthlete.Mods.Coaches.update(cond, update, function(err, numUp) {
      if (err) evtCallback(err, null);
      console.log('coach:\n', numUp);

      // return evtCallback(null, crAthlete.athlete);
      return insertTeamAthlete(crAthlete);
    });
  }

  function insertTeamAthlete(crAthlete) {
    console.log('insertTeamAthlete');

    var cond = {school: crAthlete.sess.school, name: crAthlete.team.name, gender: crAthlete.team.gender};
    var update = {$push: {athletes: {_id: crAthlete.athlete._id, name: crAthlete.athlete.name}}};
    // crAthlete.Mods.Teams.findOne(cond, function(err, numUp) {
    crAthlete.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) evtCallback(err, null);
      console.log('team:\n', numUp);

      return evtCallback(null, crAthlete.athlete);
    });
  }
}

function validateAthleteInput(athlete, callback) {
  console.log('Operations: validateAthleteInput');
  var maxCharLen = 45;
  var names = /^[_]*[A-Z0-9][A-Z0-9 _.-]*$/i;
  var height = /^[0-9]*['][0-9]*["]$/;
  var username = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  var pos = /^[A-Z0-9-/]+$/i;
  var year = /^[A-Z0-9]+$/i;
  var city = /^[A-Z][ A-Z-]+$/i;
  var state = /^[A-Z]{2}$/i;

  if (maxCharLen < athlete.name) {
    console.info("Validation: Error\n");
    var err = {name: "ValidationError", msg: 'Input exceeds number of characaters allowed', code: 422, value: athlete.name};
    return callback(err, null);
  }
  if (!names.test(athlete.fname)) return valError(athlete.fname);
  if (!names.test(athlete.lname)) return valError(athlete.lname);
  if (!height.test(athlete.height)) return valError(athlete.height);
  if (!pos.test(athlete.position)) return valError(athlete.position);
  if (!year.test(athlete.year)) return valError(athlete.year);
  if (!city.test(athlete.city)) return valError(athlete.city);
  if (!state.test(athlete.state)) return valError(athlete.state);

  return crUsername(athlete);

  function crUsername(athlete) {
      var username = '';
      for (var i in athlete)
      {
        if (i === 'height') {
          username += athlete[i].split('\'')[0];
        } else {
          username += athlete[i].slice(0,2).toLowerCase();
        }
      }
      // console.log('username:', username);
      athlete.username = username;
      return callback(null, athlete);
  }

  function valError(input) {
    console.info("Validation: Error\n");
    var err = {name: "ValidationError", msg: 'Not valid input', code: 422, value: input};
    return callback(err, null);
  }
}



// ---- GROUP ---- //

function propagateGroupDelete(delGroup, evtCallback) {
  console.info('propagating delGroup');
  deleteCoachGroup(delGroup);

  function deleteCoachGroup(delGroup) {
    console.log('deleteCoachGroup');

    //TODO:
    //  delete a single coach group rather all coaches?
    var cond = {school: delGroup.sess.school, "groups.name": delGroup.name};
    delGroup.Mods.Coaches.update(cond, delGroup.update, function(err, numUp) {
      if (err) return evtCallback(err, null);
      console.log('coach:\n', numUp);

      deleteTeamGroup(delGroup);
      return;
    });
  }

  function deleteTeamGroup(delGroup) {
    console.log('deleteTeamGroup');

    var cond = {school: delGroup.sess.school, name: delGroup.team.name, gender: delGroup.team.gender, "groups.name": delGroup.name};
    delGroup.Mods.Teams.update(cond, delGroup.update, function(err, numUp) {
      if (err) return evtCallback(err, null);
      console.log('team:\n', numUp);

      deleteAthleteGroup(delGroup);
      return;
    });
  }

  function deleteAthleteGroup(delGroup) {
    console.log('deleteAthleteGroup');

    var cond = {school: delGroup.sess.school, team: delGroup.team, "groups.name": delGroup.name};
    delGroup.Mods.Athletes.update(cond, delGroup.update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(err, null);
      console.log('athlete:\n', numUp);

      return evtCallback(null, delGroup.doc);
    });
  }
}

function propagateGroupUpdate(upGroup, evtCallback) {
  console.info('propagating upGroup');
  updateCoachGroup(upGroup);

  function updateCoachGroup(upGroup) {
    console.log('updateCoachGroup');

    var cond = {school: upGroup.sess.school, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Coaches.findOneAndUpdate(cond, update, function(err, coach) {
      if (err) return evtCallback(err, null);
      console.log('coaches:\n', coach.groups);

      updateTeamGroup(upGroup);
    });
  }

  function updateTeamGroup(upGroup) {
    console.log('updateTeamGroup');

    var cond = {school: upGroup.sess.school, name: upGroup.team.name, gender: upGroup.team.gender, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return evtCallback(err, null);
      console.log('team:\n', team.groups);

      updateAthleteGroup(upGroup);
    });
  }

  function updateAthleteGroup(upGroup) {
    console.log('updateAthleteGroup');

    var cond = {school: upGroup.sess.school, "coaches.username": upGroup.sess.username, "coaches.name": upGroup.sess.name, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Athletes.update(cond, update, {multi: true}, function(err, numUp) {
      if (err) return evtCallback(err, null);
      console.log('athletes:', numUp);

      evtCallback(null, upGroup.doc);
    });
  }
}

function propagateGroupCreate(newGroup, evtCallback) {
  console.info('propagating newGroup');
  return insertCoachGroup(newGroup);

  function insertCoachGroup(newGroup) {
    console.log('insertCoachGroup');

    var cond = {school: newGroup.sess.school, username: newGroup.sess.username, "teams.name": newGroup.team.name, "teams.gender": newGroup.team.gender};
    var update = {$push: {groups: {_id: newGroup.doc._id, name: newGroup.doc.name}}};
    newGroup.Mods.Coaches.findOneAndUpdate(cond, update, function(err, coach) {
      if (err) return evtCallback(err, null);
      console.log('coach:\n', coach.groups);

      return insertTeamGroup(newGroup);
    });
  }

  function insertTeamGroup(newGroup) {
    console.log("insertTeamGroup");

    var cond = {school: newGroup.sess.school, name: newGroup.team.name, gender: newGroup.team.gender};
    var update = {$push: {groups: {_id: newGroup.doc._id, name: newGroup.doc.name}}};
    newGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return evtCallback(err, null);
      console.log('team:\n', team.groups);

      return evtCallback(null, newGroup.doc);
    });
  }
}

function validateInput(input, callback) {
  console.log('Operations: validateInput');
  var maxCharLen = 45;
  var rego = /^[_]*[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/;
  if (maxCharLen < input.length) {
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