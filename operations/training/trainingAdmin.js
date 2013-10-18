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
      mcid: req.body.mcid,
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
        mcid: input.mcid,
        mcat: input.mcat
      };
      var newMtr = new info.Mods.Metrics();

      newMtr.createdBy = info.sess.COID;
      newMtr.school = info.sess.school;
      newMtr.team = info.team;
      newMtr.mtrcat = {_id: info.mcid, name: info.mcat};
      newMtr.name = info.mname;
      newMtr.code = crypto.createHash('md5').update((new Date).toString()).digest('hex');

      newMtr.meta.mtype = info.mtype;
      newMtr.meta.units = info.units;
      newMtr.meta.ttmetric = true;
      newMtr.meta.instructions = info.instr;
      newMtr.meta.video = info.video;

      newMtr.save(function(err) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log('Metric saved:\n', newMtr.name);

        info.metric = newMtr;
        return propagateMetricCreate(info, evtCallback);
      });
    }
  },

  updateMetric: function(req, evtCallback) {
    console.log('Operation: updateMetric');
    var val = {
      mid: req.params.id,
      tname: req.params.team,
      gender: req.params.gender,
      mname: req.body.mName,
      mtype: req.body.mtype,
      units: req.body.units,
      // ttmetric: req.body.ttmetric,
      instr: req.body.instr,
      video: req.body.video,
      mcid: req.body.mcid,
      mcat: req.body.mcat
    };

    return validateInput(val, validateExistence);

    function validateExistence(err, input) {
      if (err) return evtCallback(err, null);
      console.log("Validate Existence");

      var query = {_id: input.mid};
      req.models.Metrics.findOne(query, function(err, metric) {
        if (err) return evtCallback(dbErrors(err), null);

        if (!metric)
          return evtCallback(cliErrors("notFound"), null);

        console.log("   Success");
        if (val.mname !== metric.name)
          return addEdits(input, metric, true);

        console.log("no name change: no propagation");
        return addEdits(input, metric, false);
      });
    }

    function addEdits(info, metric, prop) {
      console.log('adding edits');

      metric.name = val.mname;
      metric.mtrcat = val.mcat;
      metric.meta = {
        mtype: val.mtype,
        units: val.units,
        instr: val.instr,
        video: val.video
      };

      metric.save(function(err) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log("Metric Updated\n");

        info.metric = metric;
        if (!prop)
          return evtCallback(null, info.metric);

        return propagateMetricUpdate(info, evtCallback);
      });
    }
  },

  deleteMetric: function(req, evtCallback) {
    console.log('Operation: deleteMetric');
    //Note:
    //  delete metric only if a parent metric category accompanies it 
    var val = {
      tname: req.params.team,
      gender: req.params.gender,
      mid: req.params.id,
      mcat: req.body.mcat
    };

    return validateInput(val, removeMetric);

    function removeMetric(err, input) {
      if (err) return evtCallback(err, null);

      var info = {
        team: {name: input.tname, gender: input.gender},
        sess: req.sess,
        Mods: req.models,
        mid: input.mid,
        mcat: input.mcat
      };
      var cond = {
        school: info.sess.school,
        'teams.name': info.team.name,
        'teams.gender': info.team.gender,
        _id: info.mid
      };
      // var update = {
      //   $set: {removed: true}
      // };

      info.Mods.Metrics.findOneAndRemove(cond, function(err, rmDoc) {
        if (err) return evtCallback(dbErrors(err), null);
      console.log('Metric removed:\n', rmDoc.name);

      info.metric = rmDoc;
      return propagateMetricDelete(info, evtCallback);
      });
    }
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
function propagateMetricDelete(delMetric, evtCallback) {
  console.info('propagating delMetric');
  deleteMCatMetric();

  function deleteMCatMetric() {
    console.log('deleteMCatMetric');

    var cond = {
      school: delMetric.sess.school,
      team: delMetric.team,
      "metrics.name": delMetric.metric.name,
      name: delMetric.mcat
      };
    var update = {
      $pull: {metrics: {name: delMetric.metric.name}}
    };
    delMetric.Mods.MetricCats.update(cond, update, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('MCat:\n', numUp, raw);

      deleteTeamMetric();
      return;
    });
  }

  function deleteTeamMetric() {
    console.log('deleteTeamMetric');

    var cond = {
      school: delMetric.sess.school,
      name: delMetric.team.name,
      gender: delMetric.team.gender,
      "mtrcats.name": delMetric.mcat
    };
    var update = {
      $pull:{'mtrcats.$.metrics': {name: delMetric.metric.name}}
    };
    delMetric.Mods.Teams.update(cond, update, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Team:\n', numUp, raw);

      deleteAthleteMetric();
      return;
    });
  }

  function deleteAthleteMetric() {
    console.log('deleteAthleteMetric');

    var cond = {
      school: delMetric.sess.school,
      team: delMetric.team,
      "mtrcats.name": delMetric.mcat
    };
    var update = {
      $pull:{'mtrcats.$.metrics': {name: delMetric.metric.name}}
    };
    delMetric.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err) , null);
      console.log('Athletes:\n', numUp, raw);

      return evtCallback(null);
    });
  }
}//END

function propagateMetricUpdate(upMetric, evtCallback) {
  console.info('propagating upMetric');
  updateMCatMetric();

  function updateMCatMetric() {
    console.log('updateMCatMetric');

    var cond = {
      _id: info.mcid,
      'metrics.name': upMetric.mname
    };
    var update= {
      $set: {'metrics.$.name': upMetric.metric.name}
    };

    upMetric.Mods.MetricCats.update(cond, update, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('MCat:\n', numUp, raw);

      updateTeamMetric();
    });
  }

  function updateTeamMetric() {
    console.log('updateTeamMetric');

    var cond = {
      school: upMetric.sess.school,
      name: upMetric.team.name,
      gender: upMetric.team.gender,
      'mtrcats.metrics._id': upMetric.metric._id
    };
    var update = {
      $set: {mtrcats: {'metrics.$.name':upMetric.metric.name}}
    };

    upMetric.Mods.Teams.update(cond, update, function(err, numUp, raw) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Team:\n', numUp, raw);

      updateAthleteMetric();
    });
  }

  function updateAthleteMetric() {
    console.log('updateAthleteMetric');

    var cond = {school: upMetric.sess.school, "coaches.username": upMetric.sess.username, "coaches.name": upMetric.sess.name, "groups.name": upMetric.oldGroup};
    var update = {$set: {'groups.$.name': upMetric.newMetric}};
    upMetric.Mods.Athletes.update(cond, update, {multi: true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('athletes:', numUp);

      evtCallback(null, upMetric.doc);
    });
  }
}//END

function propagateMetricCreate(info, evtCallback) {
  console.info('propagating Metric');

  return insertTeamMetricMCat();

  function insertTeamMetricMCat() {
    console.log('Inserting into Team');

    var cond = {
      name: info.team.name,
      gender: info.team.gender,
      'mtrcats.name': info.mcat
    };
    var update = {
      $push: {'mtrcats.$.metrics': {_id: info.metric._id, name: info.metric.name}}
    };

    // info.Mods.Teams.findOne(cond, function(err, numUp) {
    info.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Team:\n', numUp);

      return insertMCatMetric();
    });
  }

  function insertMCatMetric() {
    console.log('Inserting into Metric Category');
    var cond = {team: info.team, name: info.mcat};
    var update= {$push: {metrics: {_id: info.metric._id, name: info.metric.name}}};

    // info.Mods.MetricCats.findOne(cond, function(err, numUp) {
    info.Mods.MetricCats.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('MCAT:\n', numUp);

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