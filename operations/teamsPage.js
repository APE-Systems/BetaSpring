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
    validateInput(req.params.team, insertTeam);

    // Need to propagate new team to Coaches and School models
    function insertTeam(err, team) {
      if (err) return callback(err, null);

      var Mods = req.models;
      var school = req.sess.school;
      var newTeam = new Mods.Teams();

      newTeam.createdBy = req.sess.COID;
      newTeam.coaches.push({name: "coach name", username: req.sess.username});
      newTeam.school = school;
      newTeam.name = team;
      newTeam.gender = req.params.gender;

      // console.log(newTeam);
      newTeam.save(function(err) {
        return callback(err, newTeam);
      });
    }
  },//END createTeam

  updateTeam: function(req, callback) {
    console.log('Operation: updateTeam');
    console.log(req.body);
    // var team = req.query.team-name;
    // var gender = req.query.team.gender;
    
    // validateInput(team, editTeam);

    function editTeam(err, team) {
      if (err) return callback(err, null);

      var Mods = req.models;
      var school = req.sess.school;

      var cond = {name: team, gender: gender};
      var update = {$set: {team: {name: team, gender: gender}}};
      console.log(cond);
      console.log(update);
      // Mods.Teams.findOneAndUpdate(cond, update, function(err, upDoc) {
      //   if (err) callback(err);

      //   console.log('teamUpdate:\n', upDoc);
      //   // propagateUpdate(req, upDoc, callback);
      //   return;
      // });
    }
  },//END updateTeam

  //TODO:
  //  check to see if athletes are following this team
  //  if so, then report back before deleting
  deleteTeam: function(req, callback) {
    console.log('Operation: deleteTeam');

    var Mods, school, cond, username;
    Mods = req.models;
    school = req.sess.school;
    username: req.sess.username;
    cond = {
      name: req.params.team,
      gender:req.params.gender,
      "coaches.username": username
    };

    Mods.Teams.findOneAndRemove(cond, function(err, deldoc) {
      if (err) callback(err);

      console.log('teamDelete:', deldoc);
      propagateDelete(req, delDoc, callback);
      callback(null);
    });
  }//END deleteTeam
}

/*
  ------ HELPER FUNCTIONS ------
 */

function validateInput(tName, callback) {
  console.log('Operations: validateInput');
  var maxCharLen = 45;
  var team = tName;
  var rego = /^[_]*[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/;
  if (maxCharLen === team.length) {
    var err = {name: "ValidationError", msg: 'Team exceeds number of characaters allowed', code: 422};
    return callback(err, null);
  }
  if (!rego.test(team)) {
    var err = {name: "ValidationError", msg: 'Not valid input', code: 422};
    return callback(err, null);
  }
  return callback(null, team);
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

//NOTE:
//  Test with multiple coaches, metrics, metriccats, athletes and groups
function propagateUpdate(req, upTeam, callback) {
  var Mods = req.models;
  updateSchoolTeam(upTeam);

  function updateSchoolTeam(upTeam) {
    var cond = {
      name: req.sess.school,
      'coaches.username': req.sess.username,
      'teams.name': req.params.team,
      'teams.gender': req.params.gender
    };
    var update = {
      $set: {"teams.$.name": upTeam.name, "teams.$.gender": upTeam.gender}
    };

    APE.Schools.findOneAndUpdate(cond, update, {new: true}, function(err, schDoc) {
      if (err) throw new Error(err);

      console.info('Updated: School\n');
      updateCoachesTeam(upTeam);
      return;
    });
  }//END

  function updateCoachesTeam(upTeam) {
    //NOTE:
    //  All coaches that belong to the team are updated
    var cond = {
      school: req.sess.school,
      'teams.name': req.params.team,
      'teams.gender': req.params.gender
    };
    var update = {
      $set: {"teams.$.name": upTeam.name, "teams.$.gender": upTeam.gender}
    };
    Mods.Coaches.update(cond, update, {multi:true}, function(err, numUp, raw) {
      if (err) throw new Error(err);

      console.info("Updated: Coaches\n", numUp, raw);
      updateMetricsTeam(upTeam);
      return;
    });
  }//END

  function updateMetricsTeam(upTeam) {
    var cond = {
      school: req.sess.school,
      'teams.name': req.params.team,
      'teams.gender': req.params.gender
    };
    var update = {
      $set: {"teams.$.name": upTeam.name, "teams.$.gender": upTeam.gender}
    };
    Mods.Metrics.update(cond, update, {multi:true}, function(err, numUp, raw) {
      if (err) throw new Error(err);

      console.info("Updated: Metrics\n", numUp, raw);
      updateMetricCatsTeam(upTeam);
      return;
    });
  }//END

  function updateMetricCatsTeam(upTeam) {
    var cond = {
      school: req.sess.school,
      'team.name': req.params.team,
      'team.gender': req.params.gender
    };
    var update = {
      $set: {team: {name: upTeam.name, gender: upTeam.gender}}
    };
    Mods.MetricCats.update(cond, update, {multi:true}, function(err, numUp, raw) {
      if (err) throw new Error(err);

      console.info("Updated: Metric Categories\n", numUp, raw);
      updateAthletesTeam(upTeam);
      return;
    });
  }//END

  function updateAthletesTeam(upTeam) {
    var cond = {
      school: req.sess.school,
      'team.name': req.params.team,
      'team.gender': req.params.gender
    };
    var update = {
      $set: {team: {name: upTeam.name, gender: upTeam.gender}}
    };
    Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp, raw) {
      if (err) throw new Error(err);

      console.info("Updated: Athletes\n", numUp, raw);
      updateGroupsTeam(upTeam);
      return;
    });
  }//END
  

  function updateGroupsTeam(upTeam) {
    var cond = {
      school: req.sess.school,
      'team.name': req.params.team,
      'team.gender': req.params.gender
    };
    var update = {
      $set: {team: {name: upTeam.name, gender: upTeam.gender}}
    };
    Mods.Groups.update(cond, update, {multi:true}, function(err, numUp, raw) {
      if (err) throw new Error(err);

      console.info("Updated: Groups\n", numUp, raw);
      callback(null);
      return;
    });
  }//END
}

function propagateDelete(req, delTeam, callback) {
  var Mods = req.models;
  deleteSchoolTeam(delTeam);

  function deleteSchoolTeam(delTeam) {

  }//END

  function deleteCoachesTeam(delTeam) {

  }//END

  function deleteMetricsTeam(delTeam) {

  }//END

  function deleteMetricCatsTeam(delTeam) {

  }//END

  function deleteAthletesTeam(delTeam) {

  }//END

  function deleteGroupsTeam(delTeam) {

  }//END
}

module.exports = exports = teamsPageOps;