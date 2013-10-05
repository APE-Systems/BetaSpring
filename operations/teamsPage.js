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

  updateTeam: function(req, callback) {
    console.log('Operation: updateTeam');
    var team = req.body["team-name"];
    var gender = req.body["team-gender"];
    
    validateInput(team, editTeam);

    function editTeam(err, team) {
      if (err) return callback(err, null);

      var Mods = req.models;
      var school = req.sess.school;

      var cond = {name: req.params.team, gender: req.params.gender};
      var update = {$set: {name: team, gender: gender}};
      Mods.Teams.findOneAndUpdate(cond, update, {new: true}, function(err, upDoc) {
        if (err) return callback(dbErrors(err), null);

        console.log('teamUpdated:\n', upDoc.name, upDoc.gender);
        propagateUpdate(req, upDoc, callback);
        return;
      });
    }
  },//END updateTeam

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
      if (err) return callback(dbError(err), null);

      console.log('teamDelete:', deldoc);
      propagateDelete(req, delDoc, callback);
      return;

    });
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
function propagateUpdate(req, upTeam, callback) {
  var Mods = req.models;
  var conds = {
    school: req.sess.school,
    'teams.name': req.params.team,
    'teams.gender': req.params.gender
  };
  var cond = {
    school: req.sess.school,
    'team.name': req.params.team,
    'team.gender': req.params.gender
  };
  updateSchoolTeam(upTeam);

  function updateSchoolTeam(upTeam) {
    var schCond = {
      name: req.sess.school,
      'teams.name': req.params.team,
      'teams.gender': req.params.gender
    };
    var update = {
      $set: {"teams.$.name": upTeam.name, "teams.$.gender": upTeam.gender}
    };

    APE.Schools.update(schCond, update, function(err, numUp, raw) {
    // APE.Schools.findOne(schCond, function(err, schDoc) {
      if (err) throw new Error(err);

      console.info('Updated: School', numUp, raw);
      updateCoachesTeam(upTeam);
      return;
    });
  }//END

  function updateCoachesTeam(upTeam) {
    //NOTE:
    //  All coaches that belong to the team are updated
    var update = {
      $set: {"teams.$.name": upTeam.name, "teams.$.gender": upTeam.gender}
    };
    Mods.Coaches.update(conds, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Coaches.find(conds, function(err, numUp) {
      if (err) throw new Error(err);

      console.info("Updated: Coaches", numUp, raw);
      updateMetricsTeam(upTeam);
      return;
    });
  }//END

  function updateMetricsTeam(upTeam) {
    var update = {
      $set: {"teams.$.name": upTeam.name, "teams.$.gender": upTeam.gender}
    };
    Mods.Metrics.update(conds, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Metrics.find(conds, function(err, numUp, raw) {
      if (err) throw new Error(err);

      console.info("Updated: Metrics", numUp, raw);
      updateMetricCatsTeam(upTeam);
      return;
    });
  }//END

  function updateMetricCatsTeam(upTeam) {
    var update = {
      $set: {team: {name: upTeam.name, gender: upTeam.gender}}
    };
    Mods.MetricCats.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.MetricCats.find(cond, function(err, numUp) {
      if (err) throw new Error(err);

      console.info("Updated: Metric Categories", numUp, raw);
      updateAthletesTeam(upTeam);
      return;
    });
  }//END

  function updateAthletesTeam(upTeam) {
    var update = {
      $set: {team: {name: upTeam.name, gender: upTeam.gender}}
    };
    Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Athletes.find(cond, function(err, numUp) {
      if (err) throw new Error(err);

      console.info("Updated: Athletes", numUp, raw);
      updateGroupsTeam(upTeam);
      return;
    });
  }//END

  function updateGroupsTeam(upTeam) {
    var update = {
      $set: {team: {name: upTeam.name, gender: upTeam.gender}}
    };
    Mods.Groups.update(cond, update, {multi:true}, function(err, numUp, raw) {
    // Mods.Groups.find(cond, function(err, numUp) {
      if (err) throw new Error(err);

      console.info("Updated: Groups", numUp, raw);
      callback(null);
      return;
    });
  }//END
}

function propagateDelete(req, delTeam, callback) {
  var Mods = req.models;
  deleteSchoolTeam(delTeam);

  function deleteSchoolTeam(delTeam) {
    var schCond = {
      name: req.sess.school,
      'teams.name': req.params.team,
      'teams.gender': req.params.gender
    };

    APE.Schools.update(schCond, function(err, delDoc) {
    // APE.Schools.findOne(schCond, function(err, schDoc) {
      if (err) throw new Error(err);

      console.info('Deleted: School\n', delDoc);
      deleteCoachesTeam(delTeam);
      return;
    });
  }//END

  function deleteCoachesTeam(delTeam) {
    Mods.Coaches.update();
  }//END

  function deleteMetricsTeam(delTeam) {
    Mods.Metrics.update();
  }//END

  function deleteMetricCatsTeam(delTeam) {
    Mods.MetricCats.update()
  }//END

  function deleteAthletesTeam(delTeam) {

  }//END

  function deleteGroupsTeam(delTeam) {

  }//END
}

module.exports = exports = teamsPageOps;