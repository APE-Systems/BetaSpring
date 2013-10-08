;"use strict";
/*
  OPERATIONS: teamsPage
 */

var APE = require('../models/db/config').apeMods;
var dbErrors = require('../operations/errors.js').dbErrors;
var cliErrors = require('../operations/errors.js').cliErrors;

var teamsPageOps = {

  getTeamsPage: function(req, evtCallback) {
    console.log('Operation: getTeamsPage');

    var pgload = {
      sess: req.sess,
      Mods: req.models
    }
    var dataLoad = {};

    return getTeams(pgload);

    function getTeams(pgload) {
      var query = {school: pgload.sess.school, 'coaches.username': pgload.sess.username};
      var proj = {name:1, gender:1, mtrcats:1, metrics:1};

      pgload.Mods.Teams.find(query, proj, function(err, teams) {
        if (err) evtCallback(dbErrors(err), null);
        // console.log('teams:\n', teams);

        dataLoad.teams = teams;
        return getAPElib(pgload);
      });
    }

    function getAPElib(pgload) {
      var apeLibPackage = {};
      var query = {};
      var proj = {name:1, metrics:1};

      APE.MetricCats.find(query, proj, function(err, mcs) {
        if (err) evtCallback(dbErrors(err), null);

        apeLibPackage.mtrcats = mcs;
        APE.Metrics.find({"mtrcats.name": {$exists: false}}, {name:1}, function(err, mtrs) {
          if (err) evtCallback(dbErrors(err), null);

          apeLibPackage.metrics = mtrs;
          // console.log('apeLibPackage:\n', apeLibPackage);
          dataLoad.apeLibPackage = apeLibPackage;
          // console.log('dataLoad\n', dataLoad);
          
          evtCallback(null, dataLoad);
          return;
        });
      });
    }
  },

  createTeam: function(req, evtCallback) {
    console.log('Operation: createTeam');
    var val = {
      name: req.params.team,
      gender: req.params.gender
    };
    validateInput(val, insertTeam);

    function insertTeam(err, team) {
      if (err) return evtCallback(err, null);

      var info = {
        team: val,
        sess: req.sess,
        Mods: req.models
      };
      var newTeam = new info.Mods.Teams();

      newTeam.createdBy = info.sess.COID;
      newTeam.coaches.push({_id: info.sess.COID, username: info.sess.username, name: info.sess.name});
      newTeam.school = info.sess.school;
      newTeam.name = info.team.name;
      newTeam.gender = info.team.gender;

      // console.log(newTeam);
      saveTeam(newTeam, insertSchoolTeam);

      function saveTeam(newTeam, callback) {
        console.log('saving team');
        newTeam.save(function(err) {
          if (err) return evtCallback(dbErrors(err), null);
          return callback(newTeam, insertCoachesTeam);
        });
      }

      function insertSchoolTeam(team, callback) {
        var query = {name: team.school};
        var update = {$push: {teams: {_id: team._id, name: team.name, gender: team.gender}}}
        APE.Schools.update(query, update, function(err, numUp) {
          if (err) return evtCallback(dbErrors(err), null);
          console.log("team saved in school:", numUp);
          return callback(team);
        });
      }

      //NOTE:
      //  new team propagates to all coaches in same school
      function insertCoachesTeam(team) {
        var query = {school: team.school};
        var update = {$push: {teams: {_id: team._id, name: team.name, gender: team.gender}}}
        info.Mods.Coaches.update(query, update, {multi:true}, function(err, numUp) {
          if (err) return evtCallback(dbErrors(err), null);
          console.info("team saved in coaches:", numUp);
          return evtCallback(null, team);
        });
      }
    }
  },//END createTeam

  updateTeam: function(req, evtCallback) {
    console.log('Operation: updateTeam');
    var val = {
      oldName: req.params.team,
      oldGen: req.params.gender,
      newName: req.body["team-name"],
      newGen: req.body["team-gender"]
    };

    validateInput(val, editTeam);

    function editTeam(err, team) {
      if (err) return evtCallback(err, null);

      var info = {
        sess: req.sess,
        Mods: req.models,
        oldTeam: {
          name: val.oldName,
          gender: val.oldGen
        }
      };

      var cond = {name: team.oldName, gender: team.oldGen};
      var update = {$set: {name: team.newName, gender: team.newGen}};
      info.Mods.Teams.findOneAndUpdate(cond, update, {new: true}, function(err, upDoc) {
        if (err) return evtCallback(dbErrors(err), null);

        if (!upDoc)
          return evtCallback(cliErrors("notFound", null));

        console.log('teamUpdated:\n', upDoc.name, upDoc.gender);
        info.newTeam = upDoc;
        propagateUpdate(info, evtCallback);
        return;
      });
    }
  },//END updateTeam

  deleteTeam: function(req, evtCallback) {
    console.log('Operation: deleteTeam');
    var val = {
      name: req.params.team,
      gender: req.params.gender
    };

    validateInput(val, removeTeam);

    function removeTeam(err, team) {
      if (err) return evtCallback(err, null);

      var info = {
        sess: req.sess,
        Mods: req.models,
      };
      var cond = {name: team.name, gender: team.gender, "coaches.username": info.sess.username};
      info.Mods.Teams.findOneAndRemove(cond, function(err, delDoc) {
        if (err) return evtCallback(dbError(err), null);

        if (!delDoc)
          return evtCallback(cliErrors("notFound"));

        console.log('teamDelete:\n', delDoc.name, delDoc.gender);
        info.team = delDoc;
        propagateDelete(info, evtCallback);
        return;
      });
    }
  }//END deleteTeam
}

/*
  ------ HELPER FUNCTIONS ------
 */


function validateInput(val, callback) {
  console.log('Operations: validateInput\n');
  var maxCharLen = 45;
  var rego = /^[_]*[A-Z0-9][A-Z0-9 _.-]*$/i;
  var objs = Object.keys(val);

  if (!objs.some(checkVal)) {
    console.info("Validation: Success");
    return callback(null, val);
  }

  function checkVal(el, ind, arr) {
    if (maxCharLen < val[el].length) {
      console.info("Validation: Error\n");
      callback(cliErrors("maxCharacters"), null);
      return true;
    }
    if (!rego.test(val[el])) {
      console.info("Validation: Error\n");
      callback(cliErrors("invalidInput"), null);
      return true;
    }
  }
}//END


//NOTE:
//  Test with multiple coaches, metrics, metriccats, athletes and groups
function propagateUpdate(info, evtCallback) {
  console.log('propagating update');
  var conds = {
    school: info.sess.school,
    'teams.name': info.oldTeam.name,
    'teams.gender': info.oldTeam.gender
  };
  var cond = {
    school: info.sess.school,
    'team.name': info.oldTeam.name,
    'team.gender': info.oldTeam.gender
  };
  updateSchoolTeam();

  function updateSchoolTeam() {
    var schCond = {
      name: info.sess.school,
      'teams.name': info.oldTeam.name,
      'teams.gender': info.oldTeam.gender
    };
    var update = {
      $set: {"teams.$.name": info.newTeam.name, "teams.$.gender": info.newTeam.gender}
    };
    APE.Schools.update(schCond, update, function(err, numUp, raw) {
    // APE.Schools.findOne(schCond, function(err, schDoc) {
      if (err) return evtCallback(dbErrors(err));

      console.info('Updated: School', numUp, raw);
      updateCoachesTeam();
      return;
    });
  }//END

  function updateCoachesTeam() {
    //NOTE:
    //  All coaches that belong to the team are updated
    var update = {
      $set: {"teams.$.name": info.newTeam.name, "teams.$.gender": info.newTeam.gender}
    };
    info.Mods.Coaches.update(conds, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Coaches.find(conds, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Updated: Coaches", numUp, raw);
      updateMetricsTeam();
      return;
    });
  }//END

  function updateMetricsTeam() {
    var update = {
      $set: {"teams.$.name": info.newTeam.name, "teams.$.gender": info.newTeam.gender}
    };
    info.Mods.Metrics.update(conds, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Metrics.find(conds, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Updated: Metrics", numUp, raw);
      updateMetricCatsTeam();
      return;
    });
  }//END

  function updateMetricCatsTeam() {
    var update = {
      $set: {team: {name: info.newTeam.name, gender: info.newTeam.gender}}
    };
    info.Mods.MetricCats.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.MetricCats.find(cond, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Updated: Metric Categories", numUp, raw);
      updateAthletesTeam();
      return;
    });
  }//END

  function updateAthletesTeam() {
    var update = {
      $set: {team: {name: info.newTeam.name, gender: info.newTeam.gender}}
    };
    info.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Athletes.find(cond, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Updated: Athletes", numUp, raw);
      updateGroupsTeam();
      return;
    });
  }//END

  function updateGroupsTeam() {
    var update = {
      $set: {team: {name: info.newTeam.name, gender: info.newTeam.gender}}
    };
    info.Mods.Groups.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Groups.find(cond, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Updated: Groups", numUp, raw);
      evtCallback(null, info.newTeam);
      return;
    });
  }//END
}

function propagateDelete(info, evtCallback) {
  console.log('propagating delete');

  var conds = {
    school: info.sess.school,
    'teams.name': info.team.name,
    'teams.gender': info.team.gender
  };
  var cond = {
    school: info.sess.school,
    'team.name': info.team.name,
    'team.gender': info.team.gender
  };
  var updates = {$pull: {teams: {name: info.team.name, gender: info.team.gender}}};
  var update = {$set: {"team.name":'', "team.gender": ''}};
  deleteSchoolTeam();

  function deleteSchoolTeam() {
    var schCond = {
      name: info.sess.school,
      'teams.name': info.team.name,
      'teams.gender': info.team.gender
    };

    APE.Schools.update(schCond, updates, function(err, numUp, raw) {
    // APE.Schools.findOne(schCond, function(err, schDoc) {
      if (err) return evtCallback(dbErrors(err));

      console.info('Deleted: School\n', numUp, raw);
      deleteCoachesTeam();
      return;
    });
  }//END

  function deleteCoachesTeam(delTeam) {
    //NOTE:
    //  All coaches that belong to the team are updated
    info.Mods.Coaches.update(conds, updates, {multi:true}, function(err, numUp, raw) {
    // Mods.Coaches.find(conds, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Deleted: Coaches", numUp, raw);
      deleteMetricsTeam();
      return;
    });
  }//END

  function deleteMetricsTeam() {
    info.Mods.Metrics.update(conds, updates, {multi:true}, function(err, numUp, raw) {
    // Mods.Metrics.find(conds, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Deleted: Metrics", numUp, raw);
      deleteMetricCatsTeam();
      return;
    });
  }//END

  function deleteMetricCatsTeam() {
    info.Mods.MetricCats.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.MetricCats.find(cond, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Deleted: Metric Categories", numUp, raw);
      deleteAthletesTeam();
      return;
    });
  }//END

  function deleteAthletesTeam() {
    info.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Athletes.find(cond, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Deleted: Athletes", numUp, raw);
      deleteGroupsTeam();
      return;
    });
  }//END

  function deleteGroupsTeam() {
    info.Mods.Groups.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Groups.find(cond, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));

      console.info("Deleted: Groups", numUp, raw);
      evtCallback(null);
      return;
    });
  }//END
}

module.exports = exports = teamsPageOps;