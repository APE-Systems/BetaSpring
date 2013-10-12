;"use strict";
/*
  OPERATIONS: trainingAdmin
 */

var APE = require('../../models/db/config').apeMods;
var dbErrors = require('../errors.js').dbErrors;
var cliErrors = require('../errors.js').cliErrors;
var crypto = require('crypto');

var trainingAdminOps = {

  getTrainingAdmin: function(req, evtCallback) {
    console.log('Operation: getTrainingAdmin');

    var val = {
      name: req.params.team,
      gender: req.params.gender
    };

    return validateInput(val, getMetricCats);

    function getMetricCats(err, val) {
      if (err) return evtCallback(err, null);
      console.log('getting metric categories');

      var pgload = {
        team: val,
        sess: req.sess,
        Mods: req.models
      };
      //NOTE:
      //  assuming that all metricics belong to a metricCat
      var query = {name: pgload.team.name, gender: pgload.team.gender};
      var proj = {mtrcats:1}
      pgload.Mods.Teams.findOne(query, proj, function(err, team) {
        if (err) return evtCallback(dbErrors(err), null);

        if (!team)
          return evtCallback(cliErrors("notFound"), null);

        pgload.mtrcats = team;
        return getAPElib(pgload);
      });
    }//END

    function getAPElib(pgload) {
      console.log('getting APE Lib\n');
      var apeLibPackage = {};
      var query = {};
      var proj = {name:1, metrics:1};
      APE.MetricCats.find(query, proj, function(err, mcs) {
        if (err) return evtCallback(dbErrors(err), null);

        apeLibPackage.mtrcats = mcs;
        APE.Metrics.find({"mtrcats.name": {$exists: false}}, {name:1}, function(err, mtrs) {
          if (err) return evtCallback(dbErrors(err), null);

          apeLibPackage.metrics = mtrs;
          // console.log('apeLibPackage:\n', apeLibPackage);
          pgload.apeLibPackage = apeLibPackage;
          // console.log('pgload\n', pgload);
          
          evtCallback(null, pgload);
          return;
        });
      });
    }//END
  },


  //METRIC CATEGORY
  createMetricCat: function(req, evtCallback) {
    console.log('Operation: createMetricCat');
    var val = {
      tname: req.params.team,
      gender: req.params.gender,
      mcname: req.body.mcName
    };

    return validateInput(val, forgeMetricCat);

    function forgeMetricCat(err, input) {
      if (err) return evtCallback(err, null);

      var info = {
        team: {name: input.tname, gender: input.gender},
        sess: req.sess,
        Mods: req.models,
        mcname: input.mcname
      };
      var newMcat = new info.Mods.MetricCats();

      newMcat.createdBy = info.sess.COID;
      newMcat.school = info.sess.school;
      newMcat.team = info.team;
      newMcat.name = info.mcname;

      // console.log('newMcat:\n', newMcat);
      // return evtCallback(null, newMcat);
      // info.mCat = newMcat;
      // return propagateMCatCreate(info, evtCallback);
      newMcat.save(function(err) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log('MCat saved:\n', newMcat.name);

        info.mCat = newMcat;
        return propagateMCatCreate(info, evtCallback);
      });
    }
  },

  updateMetricCat: function(req, evtCallback) {
    console.log('Operations: updateMetricCat');
    var val = {
          MCID: req.params.id,
          newName: req.body.edName,
          tname: req.params.team,
          gender: req.params.gender
        };

    return validateInput(val, validateExistence);

    function validateExistence(err, input) {
      if (err) return evtCallback(err, null);
      console.log("Validate Existence");

      var query = {_id: input.MCID};
      req.models.MetricCats.findOne(query, function(err, mcat) {
        if (err) return evtCallback(dbErrors(err), null);

        if (!mcat)
          return evtCallback(cliErrors("notFound"), null);

        console.log("   Success");
        return checkForChange(input, mcat);
      });
    }

    function checkForChange(input, mcat) {
      console.log("Check for Change");
      if (input.newName === mcat.name) {
        console.log("   no name change");
        return evtCallback(null, mcat);
      }
      var info = {
        newName: input.newName,
        team: {name: input.tname, gender: input.gender},
        sess: req.sess,
        Mods: req.models
      };

      console.log('   Change\n')
      console.log("Update Change");
      // return evtCallback(null, mcat);
      return addEdit(info, mcat);
    }

    function addEdit(info, mcat) {
      mcat.name = info.newName;
      mcat.save(function(err) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log("Metric Category Updated\n");

        info.mcat = mcat;
        // return evtCallback(null, info.mcat);
        return propagateMCatUpdate(info, evtCallback);
      });
      // info.mcat = mcat;
      // return propagateMCatUpdate(info, evtCallback);
    }
  },

  deleteMetricCat: function(req, evtCallback) {
    console.log('Operation: deleteMetricCat');
    var val = {
      tname: req.params.team,
      gender: req.params.gender,
      mcid: req.params.id
    }

    //Does not check if metrics follow
    return validateInput(val, removeMetricCat);

    function removeMetricCat(err, input) {
      if (err) return evtCallback(err, null);

      var info = {
        team: {name: input.tname, gender: input.gender},
        sess: req.sess,
        Mods: req.models,
        mcid: input.mcid
      };

      var cond = {
        school: info.sess.school,
        team: info.team,
        _id: info.mcid};

      info.Mods.MetricCats.findOneAndRemove(cond, function(err, rmDoc) {
        if (err) return evtCallback(dbErrors(err), null);
      console.log('rmMCat:\n', rmDoc.name);

      info.mcat = rmDoc;
      return propagateMCatDelete(info, evtCallback);
      });
    }
  },


  //METRIC
  createMetric: function(req, evtCallback) {
    console.log('Operation: createMetric');
    var val = {
      tname: req.params.team,
      gender: req.params.gender,
      mname: req.body.mName,
      mtype: req.body.mtype,
      units: req.body.units,
      // ttmetric: req.body.ttmetric,
      instr: req.body.instr,
      video: req.body.video,
      mcat: req.body.mcat
    };

    return validateInput(val, forgeMetric);

    function forgeMetric(err, input) {
      if (err) return evtCallback(err, null);

      var info = {
        team: {name: input.tname, gender: input.gender},
        sess: req.sess,
        Mods: req.models,
        mname: input.mname,
        mtype: input.mtype,
        units: input.units,
        // ttmetric: input.ttmetric,
        instr: input.instr,
        video: input.video,
        mcat: input.mcat
      };
      var newMtr = new info.Mods.Metrics();

      newMtr.createdBy = info.sess.COID;
      newMtr.school = info.sess.school;
      newMtr.teams.push(info.team);
      newMtr.name = info.mname;
      newMtr.code = crypto.createHash('md5').update((new Date).toString()).digest('hex');

      newMtr.meta.mtype.push(info.mtype);
      newMtr.meta.units.push(info.units);
      newMtr.meta.ttmetric = true;
      newMtr.meta.instructions = info.instr;
      newMtr.meta.video = info.video;

      // console.log('newMtr:\n', newMtr);
      // return evtCallback(null, newMtr);
      info.metric = newMtr;
      return propagateMetricCreate(info, evtCallback);
      // newMtr.save(function(err) {
      //   if (err) return evtCallback(dbErrors(err), null);
      //   console.log('MCat saved:\n', newMtr.name);

      //   info.mCat = newMtr;
      //   return propagateMCatCreate(info, evtCallback);
      // });
    }
  },

  updateMetric: function() {

  },

  deleteMetric: function() {

  },

  pushMetricToMCat: function(req, evtCallback) {
    console.log("Operation: pushAthletesToGroups");

    var info = {
      grpId: req.params.id,
      athIds: req.body.athletes,
      Mods: req.models
    };
    var athct = 0;
    var grpct = 0;
    var athletes = [];

    return validateIds(req.params.id, function(err, ids) {
      if (err) return evtCallback(err);
      validateIds(req.body.athletes, addAthletesToGroup)
    });

    //TODO:
    //  check if athlete is in group before adding
    function addAthletesToGroup(err, input) {
      if (err) return evtCallback(err);
      console.log('add athletes to group');

      for (var i=0; i<input.length; i++) {
        var cond = {_id: input[i]};
        getAthlete(cond);
      }

      function getAthlete(cond) {
        var proj = {name:1};

        info.Mods.Athletes.findOne(cond, proj, function(err, ath) {
          if (err) return evtCallback(dbErrors(err));

          athct += 1;
          athletes.push(ath);
          if (input.length === athct)
            return pushAthletes(athletes);
        });
      }

      function pushAthletes(aths) {
        var cond = {_id: info.grpId};
        var update = {$push: {athletes: {$each: aths}}};

        info.Mods.Groups.update(cond, update, function(err, numUp) {
          if (err) return evtCallback(dbErrors(err));
          console.log('athletes added to group:\n', numUp);

          addGroupToAthlete(aths);
        });
      }
    }

    function addGroupToAthlete(aths) {
      // console.log('athletes:\n', aths);
      console.log('add group to athletes');

      return getGroup(info.grpId);

      function getGroup(id) {
        var query = {_id: id};
        var proj = {name:1};
        info.Mods.Groups.findOne(query, proj, function(err, grp) {
          if (err) return evtCallback(dbErrors(err));

          pushGroup(grp);
        });
      }

      function pushGroup(grp) {
        var update = {$push: {groups: {_id: grp._id, name: grp.name}}};
        for (var i=0; i<aths.length; i++) {
          var cond = {_id: aths[i]._id};
          updateAth(cond);
        }

        function updateAth(cond) {
          // info.Mods.Athletes.findOne(cond, {name:1}, function(err, numUp) {
          info.Mods.Athletes.update(cond, update, function(err, numUp) {
            if (err) return evtCallback(dbErrors(err));

            grpct +=1;
            if (grpct === aths.length) {
              console.log('group added to athletes\n');
              return evtCallback(null);
            }
          });
        }
      }
    }
  },

  pullMetricFromMCat: function(req, evtCallback) {
    console.log("Operation: pullAthletesFromGroups");

    var info = {
      grpId: req.params.id,
      athIds: req.body.athletes,
      Mods: req.models
    };
    var athletes = [];
    var athct = 0;
    var grpct = 0;

    return validateIds(req.params.id, function(err, ids) {
      if (err) return evtCallback(err);
      validateIds(req.body.athletes, removeAthletesFromGroup)
    });

    function removeAthletesFromGroup(err, input) {
      if (err) return evtCallback(err, null);
      console.log('removing athletes from group');
      console.log(input);
      var cond = {_id: info.grpId};

      for (var i=0; i<input.length; i++) {
        var update = {$pull: {athletes: {_id: input[i]}}};
        pullAthlete(cond, update);
      }

      function pullAthlete(cond, update) {
        info.Mods.Groups.update(cond, update, function(err, numUp) {
          if (err) return evtCallback(dbErrors(err));

          athct += 1;
          if (athct === input.length) {
            console.log('athletes removed from group')
            return removeGroupFromAthletes(input);
          }
        });
      }
    }//END

    function removeGroupFromAthletes(input) {
      console.log('remove group from athletes');

      var update = {$pull: {groups: {_id: info.grpId}}};
      for (var i=0;i<input.length; i++) {
        var cond = {_id: input[i]};
        pullGroup(cond, update);
      }

      function pullGroup(cond, update) {
        info.Mods.Athletes.update(cond, update, function(err, numUp) {
          if (err) return evtCallback(dbErrors(err));

          grpct += 1;
          if (grpct === input.length) {
            console.log('group removed from athletes\n')
            return evtCallback(null);
          }
        });
      }
    }//END
  }//END
};


/*
  ------ HELPER FUNCTIONS ------
 */


  // ---- METRIC CATEGORY ---- //

function propagateMCatUpdate(info, evtCallback) {
  console.info('propagating metric category');

  var update = {$set: {'mtrcats.$.name': info.newName}};
  return updateTeamMCat();

  function updateTeamMCat() {
    console.log('updating team');
    var cond = {name: info.team.name, gender: info.team.gender, 'mtrcats._id': info.mcat._id};

    // info.Mods.Teams.findOne(cond, function(err, numUp) {
    info.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Team:\n', numUp);

      // return evtCallback(null, info.mcat);
      return updateAthletesMCat();
    })
  }

  function updateAthletesMCat() {
    console.log('updating athletes');
    var cond = {team: info.team, 'mtrcats._id': info.mcat._id};

    // info.Mods.Athletes.find(cond, function(err, numUp) {
    info.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Athletes:\n', numUp);

      // return evtCallback(null, info.mcat);
      return updateMetricsMCat();
    });
  }

  function updateMetricsMCat() {
    console.log('updating metrics');
    var cond = {'teams.name': info.team.name, 'teams.gender': info.team.gender, 'mtrcats._id': info.mcat._id};

    // info.Mods.Metrics.find(cond, function(err, numUp) {
    info.Mods.Metrics.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Metrics:\n', numUp);

      return evtCallback(null, info.mcat);
    });
  }
}//END

function propagateMCatDelete(delMcat, evtCallback) {
  console.info('propagating delete metric category');

  var update = {$pull: {mtrcats: {_id: delMcat.mcat._id}}};
  return removeTeamMCat();

  function removeTeamMCat() {
    console.log('deleting from team');
    var cond = {name: delMcat.team.name, gender: delMcat.team.gender, 'mtrcats._id': delMcat.mcat._id};

    // delMcat.Mods.Teams.findOne(cond, function(err, numUp) {
    delMcat.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log(numUp);

      return removeAthletesMCat();
    });
  }

  function removeAthletesMCat() {
    console.log('removing from athletes');
    var cond = {team: delMcat.team, 'mtrcats._id': delMcat.mcat._id};

    // delMcat.Mods.Athletes.find(cond, function(err, numUp) {
    delMcat.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log(numUp);

      return removeMetricsMCat();
    });
  }

  function removeMetricsMCat() {
    console.log('removing metrics');
    var cond = {'teams.name': delMcat.team.name, 'teams.gender': delMcat.team.gender, 'mtrcats._id': delMcat.mcat._id};

    // delMcat.Mods.Metrics.find(cond, function(err, numUp) {
    delMcat.Mods.Metrics.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log(numUp);

      return evtCallback(null);
    });
  }
}//END

function propagateMCatCreate(info, evtCallback) {
  console.info('propagating MCAT info');
  return insertTeamMCat(info);

  function insertTeamMCat(info) {
    console.log('insertTeamMCat');

    var cond = {school: info.sess.school, name: info.team.name, gender: info.team.gender};
    var update = {$push: {mtrcats: {_id: info.mCat._id, name: info.mCat.name}}};
    // info.Mods.Teams.findOne(cond, function(err, numUp) {
    info.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Team:\n', numUp);

      if (numUp === 0)
        return evtCallback(cliErrors("notFound"), null);

      return evtCallback(null, info.mCat);
    });
  }
}//END


  // ---- METRIC ---- //

function propagateMetricDelete(delGroup, evtCallback) {
  console.info('propagating delGroup');
  deleteCoachGroup(delGroup);

  function deleteCoachGroup(delGroup) {
    console.log('deleteCoachGroup');

    //TODO:
    //  delete a single coach group rather all coaches?
    var cond = {school: delGroup.sess.school, "groups.name": delGroup.name};
    delGroup.Mods.Coaches.update(cond, delGroup.update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('coach:\n', numUp);

      deleteTeamGroup(delGroup);
      return;
    });
  }

  function deleteTeamGroup(delGroup) {
    console.log('deleteTeamGroup');

    var cond = {school: delGroup.sess.school, name: delGroup.team.name, gender: delGroup.team.gender, "groups.name": delGroup.name};
    delGroup.Mods.Teams.update(cond, delGroup.update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('team:\n', numUp);

      updateMetricCatGroup(delGroup);
      return;
    });
  }

  function updateMetricCatGroup(delGroup) {
    console.log('updateMetricCatGroup');

    var cond = {school: delGroup.sess.school, team: delGroup.team, "groups.name": delGroup.name};
    delGroup.Mods.Athletes.update(cond, delGroup.update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err) , null);
      console.log('athlete:\n', numUp);

      return evtCallback(null, delGroup.doc);
    });
  }
}//END

function propagateMetricUpdate(upGroup, evtCallback) {
  console.info('propagating upGroup');
  updateCoachGroup(upGroup);

  function updateCoachGroup(upGroup) {
    console.log('updateCoachGroup');

    var cond = {school: upGroup.sess.school, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newMetric}};
    upGroup.Mods.Coaches.findOneAndUpdate(cond, update, function(err, coach) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('coaches:\n', coach.groups);

      updateTeamGroup(upGroup);
    });
  }

  function updateTeamGroup(upGroup) {
    console.log('updateTeamGroup');

    var cond = {school: upGroup.sess.school, name: upGroup.team.name, gender: upGroup.team.gender, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newMetric}};
    upGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('team:\n', team.groups);

      updateAthleteGroup(upGroup);
    });
  }

  function updateAthleteGroup(upGroup) {
    console.log('updateAthleteGroup');

    var cond = {school: upGroup.sess.school, "coaches.username": upGroup.sess.username, "coaches.name": upGroup.sess.name, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newMetric}};
    upGroup.Mods.Athletes.update(cond, update, {multi: true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('athletes:', numUp);

      evtCallback(null, upGroup.doc);
    });
  }
}//END

function propagateMetricCreate(info, evtCallback) {
  console.info('propagating Metric');

  return insertTeamMetricMCat();

  function insertTeamMetricMCat() {
    console.log('Inserting into Team');
    console.log(info);
    var cond = {name: info.team.name, gender: info.team.gender, 'mtrcats.name': info.mcat};
    var update = {$push: {'mtrcats.$.metrics': {_id: info.metric._id, name: info.metric.name}}};

    info.Mods.Teams.findOne(cond, function(err, numUp) {
    // info.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log(numUp);

      return insertMCatMetric();
    });
  }

  function insertMCatMetric() {
    console.log('Inserting into Metric Category');
    var cond = {team: info.team, name: info.mcat};
    var update= {$push: {metrics: {_id: info.metric._id, name: info.metric.name}}};

    info.Mods.MetricCats.findOne(cond, function(err, numUp) {
    // info.Mods.MetricCats.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log(numUp);

      return evtCallback(null, info.metric);
    });
  }

}//END

function validateInput(val, callback) {
  console.log('Operations: validateInput\n');
  var maxCharLen = 45;
  var rego = /^[_]*[A-Z0-9][A-Z0-9 _.,-]*$/i;
  var urlReg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  var objs = Object.keys(val);

  if (!objs.some(checkVal)) {
    console.info("Validation: Success");
    return callback(null, val);
  }

  function checkVal(el, ind, arr) {
    if (maxCharLen < val[el].length) {
      console.info("Validation: Max Characters Error\n");
      callback(cliErrors("maxCharacters"), null);
      return true;
    }
    if (el === 'video') {
      if (!urlReg.test(val['video'])) {
        console.info("URL Validation: Error\n");
        callback(cliErrors("invalidInput"), null);
        return true
      }
    } else {
      if (!rego.test(val[el])) {
        console.info("Validation: Error\n");
        console.info(val[el]);
        callback(cliErrors("invalidInput"), null);
        return true;
      }
    }
  }
}//END

function validateIds(input, callback) {
  console.log("Operations: validateIds");

  var input = input.replace(/[\["\]]/g, '').split(',');
  var maxCharLen = 35;
  var regId= /^[A-Z0-9][A-Z0-9]*$/i;

  for (var i=0; i<input.length; i++) {
    if (maxCharLen < input[i].length) {
      console.info("Validation: Error\n");
      return callback(cliErrors("maxCharacters"), null);
    }
    if (!regId.test(input[i])) {
      console.info("Validation: Error\n", input[i]);
      return callback(cliErrors("invalidIDinput"), null);
    }
  }

  console.info("Validation: Success\n");
  return callback(null, input);
}//END

module.exports = exports = trainingAdminOps;