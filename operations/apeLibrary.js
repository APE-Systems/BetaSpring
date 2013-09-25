;"use strict";
/*
  OPERATIONS: apeLIbrary
 */

var APE = require('../models/db/config').apeMods;

var ApeLibOps = {

  createMetricCat: function(req, team, mtrcat, callback) {
    console.log('Operation: createMetricCat');
    var Mods = req.models;

    validateInput(mtrcat, function(err, mtrcat) {
      if (err) return callback(err, null);

      var newMtrcat = new Mods.MetricCats();
      newMtrcat.createdBy = req.sess.COID;
      newMtrcat.school = req.sess.school;
      newMtrcat.name = mtrcat;

      if (team.name) {
        newMtrcat.team = team;
      }

      console.log('newMtrcat', newMtrcat);
      // newMtrcat.save(function(err) {
      //   if (err) return callback(err, null);

      //   if (team.name) {
      //     propagateNewMtrcat(newMtrcat, callback);
      //     return;
      //   }

      //   callback(null, newMtrcat);
      //   return;
      // });
    });

    function propagateNewMtrcat(newMtrcat, callback) {
      var cond = {name: newMtrcat.team.name, gender: newMtrcat.team.gender};
      var update = {$push: {mtrcats: {_id: newMtrcat._id, name: newMtrcat.name}}};

      Mods.Teams.update(cond, update, function(err, numUp, raw) {
        if (err) return callback(err, null);

        console.log('Updated: Team', numUp, raw)
        callback(null, newMtrcat);
        return;
      });
    }
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
        if (err) callback(err);

        console.log('teamUpdated:\n', upDoc.name, upDoc.gender);
        propagateUpdate(req, upDoc, callback);
        return;
      });
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

function validateInput(mtrcatName, callback) {
  console.log('Operations: validateInput\n');
  var maxCharLen = 45;
  var mtrcat = mtrcatName;
  var rego = /^[_]*[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/;
  if (maxCharLen === mtrcat.length) {
    var err = {name: "ValidationError", msg: 'Metric Category exceeds number of characaters allowed', code: 422};
    return callback(err, null);
  }
  if (!rego.test(mtrcat)) {
    var err = {name: "ValidationError", msg: 'Not valid input', code: 422};
    return callback(err, null);
  }
  return callback(null, mtrcat);
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

module.exports = exports = ApeLibOps;