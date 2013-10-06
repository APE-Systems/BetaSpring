;"use strict";
/*
  OPERATIONS: trainingAdmin
 */

var APE = require('../../models/db/config').apeMods;
var dbErrors = require('../errors.js').dbErrors;
var cliErrors = require('../errors.js').cliErrors;

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

  createMetricCat: function(req, evtCallback) {
    console.log('Operation: createMetricCat');
    var val = {
      tname: req.params.team,
      gender: req.params.gender,
      mcname: req.body.mcatName
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
      // info.mCat = newMcati;
      // return propageMCatCreate(info, evtCallback);
      newMcat.save(function(err) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log('MCat saved:\n', newMcat.name);

        info.mCat = newMcat;
        return propageMCatCreate(info, evtCallback);
      });
    }
  },

  createMetric: function(req, evtCallback) {
    console.log('Operation: updateAthlete');
    var athlete = {
      _id: req.params.id,
      fname: req.body.fname,
      lname: req.body.lname,
      height: req.body.height,
      position: req.body.position,
      year: req.body.year,
      city: req.body.city,
      state: req.body.state
    };

    return validateUpdateAthleteInput(athlete, validateExistence);

    function validateExistence(err, athlete) {
      if (err) evtCallback(err, null);
      console.log("validating athlete id");

      var query = {_id: athlete._id};
      req.models.Athletes.findOne(query, checkForNameDiff(athlete));
    }

    function checkForNameDiff(athlete) {
      return function(err, ath) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log('checking for name changes');
        if (!ath) {
          return evtCallback(cliErrors("notFound"), null);
        }

        var query = {
          _id: athlete._id,
          name: athlete.fname + ' ' + athlete.lname,
          position: athlete.position,
          year: athlete.year,
          hometown: athlete.city + ", " + athlete.state,
          height: athlete.height
        };

        req.models.Athletes.findOne({_id: query._id, name: query.name}, function(err, ath) {
          if (err) return evtCallback(dbErrors(err), null);

          if (ath) {
          console.log('no name change');
          return checkForAttributeDiff(query, athlete);
          }

          return addEditsAndPropagate(query, athlete);
        });
      }

      function checkForAttributeDiff(query, athlete) {
        console.log('checking for attribute changes');
        //NOTE:
        //  if athlete found, then do not propagate change
        req.models.Athletes.findOne(query, function(err, ath) {
          if (err) return evtCallback(dbErrors(err), null);

          if (ath) {
            console.log('athlete found: no edits\n', ath.name);
            return evtCallback(null, ath);
          }

          return addEdits(query, athlete);
        });
      }

      function addEdits(update, athlete) {
        console.log('adding athletes edits without propagating');
        delete update['_id'];

        req.models.Athletes.findOneAndUpdate({_id: athlete._id}, update, function(err, numUp) {
          if (err) return evtCallback(dbErrors(err), null);
          console.log('athlete updated:\n', numUp);

          return evtCallback(null, athlete);
        });
      }

      function addEditsAndPropagate(update, athlete) {
        console.log('adding athletes and propagating edits');
        var upAthlete = {
          team: {name: req.params.team, gender: req.params.gender},
          sess: req.sess,
          Mods: req.models
        };
        delete update['_id'];

        upAthlete.Mods.Athletes.findOneAndUpdate({_id: athlete._id}, update, function(err, ath) {
          if (err) return evtCallback(dbErrors(err), null);
          console.log('athlete updated:\n', ath);

          upAthlete.athlete = ath;
          return propagateAthleteUpdate(upAthlete, evtCallback);
        });
      }
    }
  },

  updateMetricCat: function(req, evtCallback) {
    console.log('Operation: deleteAthlete');
    var delMcat = {
          _id: req.params.id,
          team: {name: req.params.team, gender: req.params.gender},
          sess: req.sess,
          Mods: req.models
        };
    var cond = {_id: delMcat._id};

    // delMcat.Mods.Athletes.findOne(cond, function(err, deldoc) {
    delMcat.Mods.Athletes.findOneAndRemove(cond, function(err, deldoc) {
      if (err) return evtCallback(dbErrors(err));

      if (!deldoc) {
        console.log("Athlete not found for deletion");
        var msg = {name:"DeleteAthlete" , msg:"Athlete not found", code: 404};
        return evtCallback(cliErrors("notFound"));
      }
      console.log('deleted athlete:', deldoc);
      delMcat.athlete = deldoc;
      return propagateAthleteDelete(delMcat, evtCallback);
    });
  },

  updateMetric: function(req, evtCallback) {
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

      crGroup.save(function(err) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log("Group saved:", crGroup.name);

        newGroup.doc = crGroup;
        propagateGroupCreate(newGroup, evtCallback);
      });
    }
  },

  deleteMetricCat: function(req, evtCallback) {
    console.log('Operation: deleteMetricCat');
    var val = {
      tname: req.params.team,
      gender: req.params.gender,
      mcid: req.params.mcat
    }

    validateInput(val, removeMetricCat);

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
      propagateMCatDelete(info, evtCallback);
      });
    }
  },

  deleteMetric: function(req, evtCallback) {
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
        if (err) return evtCallback(dbErrors(err), null);
      console.log('delGroup:\n', group);

      delGroup.doc = group;
      propagateGroupDelete(delGroup, evtCallback);
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



// ---- ATHLETE ---- //

function propagateMCatDelete(delMcat, evtCallback) {
  console.info('propagating delete metric category');
  return removeTeamMCat();

  function removeTeamMCat() {
    console.log('deleting from team');
    var cond = {name: delMcat.team.name, gender: delMcat.team.gender, 'mtrcats._id': delMcat.mcat._id};
    var update = {$pull: {mtrcats: {_id: delMcat.mcat._id}}};

    // delMcat.Mods.Teams.findOne(cond, function(err, numUp) {
    delMcat.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('Team:\n', numUp);

      return evtCallback(null);
    });
  }
}//END

function propagateAthleteUpdate(upAthlete, evtCallback) {
  console.info('propagating upAthlete');
  return upsertSchoolAthlete(upAthlete);

  function upsertSchoolAthlete(upAthlete) {
    console.log('updating school');
    var cond = {name: upAthlete.sess.school, "athletes._id": upAthlete.athlete._id};
    var update = {$set: {"athletes.$.name": upAthlete.athlete.name}};

    APE.Schools.findOneAndUpdate(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('school:\n', numUp.athletes);

      return upsertCoachAthlete(upAthlete);
    });
  }

  function upsertCoachAthlete(upAthlete) {
    console.log('updating coach');
    var cond = {school: upAthlete.sess.school, "athletes._id": upAthlete.athlete._id};
    var update = {$set: {"athletes.$.name": upAthlete.athlete.name}};

    upAthlete.Mods.Coaches.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('coach:\n', numUp);

      return upsertTeamAthlete(upAthlete);
    });
  }

  function upsertTeamAthlete(upAthlete) {
    console.log('updating team');
    var cond = {school: upAthlete.sess.school, name: upAthlete.team.name, gender: upAthlete.team.gender, "athletes._id": upAthlete.athlete._id};
    var update = {$set: {"athletes.$.name": upAthlete.athlete.name}};

    upAthlete.Mods.Teams.findOneAndUpdate(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('team:\n', numUp.athletes);

      return upsertGroupAthlete(upAthlete);
    });
  }

  function upsertGroupAthlete(upAthlete) {
    console.log('updating group');
    //NOTE:
    //  could potentially use .apply here on the array
    var grp = upAthlete.athlete.groups;
    if (grp) {
      for (var i=0; i<grp.length;i++) {
        console.log('group:\n', grp[i]);
        applyGroupUpdate(grp[i]);
      }
      return upsertMetricCatAthlete(upAthlete);
    } else {
      console.info('no group to update');
      return upsertMetricCatAthlete(upAthlete);
    }

    function applyGroupUpdate(group) {
      var cond = {school: upAthlete.sess.school, team: upAthlete.team, name: group.name, "athletes._id": upAthlete.athlete._id};
      var update = {$set: {"athletes.$.name": upAthlete.athlete.name}};

      upAthlete.Mods.Groups.update(cond, update, {multi: true}, function(err, numUp) {
        if (err) return evtCallback(dbErrors(err), null);
        console.log('group:\n', numUp);
        return;
      });
    }
  }

  function upsertMetricCatAthlete(upAthlete) {
    //NOTE:
    //  index the conditional search
    console.log('updating metric category');
    var cond = {school: upAthlete.sess.school, team: upAthlete.team, "athletes._id": upAthlete.athlete._id};
    var update = {$set: {"athletes.$.name": upAthlete.athlete.name}};

    upAthlete.Mods.MetricCats.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('MetricCats:\n', numUp);

      return upsertMetricAthlete(upAthlete);
    });
  }

  function upsertMetricAthlete(upAthlete) {
    console.log('updating metrics');
    var cond = {school: upAthlete.sess.school, "athletes._id": upAthlete.athlete._id};
    var update = {$set: {"athletes.$.name": upAthlete.athlete.name}};

    upAthlete.Mods.Metrics.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Metrics:\n', numUp);

      return upsertAthmetricAthlete(upAthlete);
    });
  }

  function upsertAthmetricAthlete(upAthlete) {
    console.log('updating athmetrics');
    var cond = {school: upAthlete.sess.school, team: upAthlete.team, "athlete._id": upAthlete.athlete._id};
    var update = {$set: {'athlete.name': upAthlete.athlete.name}};

    upAthlete.Mods.Athmetrics.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('Athmetrics:\n', numUp);

      return evtCallback(null, upAthlete.athlete);
    });
  }
}

function propageMCatCreate(info, evtCallback) {
  console.info('propagating MCAT info');
  return insertTeamMCat(info);

  function insertTeamMCat(info) {
    console.log('insertTeamMCat');

    var cond = {name: info.sess.school, name: info.team.name, gender: info.team.gender};
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
}

function validateUpdateAthleteInput(athlete, callback) {
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
    return callback(cliErrors("maxCharacters"), null);
  }
  if (!names.test(athlete.fname)) return valError(athlete.fname);
  if (!names.test(athlete.lname)) return valError(athlete.lname);
  if (!height.test(athlete.height)) return valError(athlete.height);
  if (!pos.test(athlete.position)) return valError(athlete.position);
  if (!year.test(athlete.year)) return valError(athlete.year);
  if (!city.test(athlete.city)) return valError(athlete.city);
  if (!state.test(athlete.state)) return valError(athlete.state);

  return callback(null, athlete);

  function valError(input) {
    console.info("Validation: Error\n");
    return callback(cliErrors("invalidInput"), null);
  }
}

function validateCreateAthleteInput(athlete, callback) {
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
    return callback(cliErrors("maxCharacters"), null);
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
    //NOTE:
    //  this creates a uniqueID based on body data
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
    return callback(cliErrors("invalidInput"), null);
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

      deleteAthleteGroup(delGroup);
      return;
    });
  }

  function deleteAthleteGroup(delGroup) {
    console.log('deleteAthleteGroup');

    var cond = {school: delGroup.sess.school, team: delGroup.team, "groups.name": delGroup.name};
    delGroup.Mods.Athletes.update(cond, delGroup.update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err) , null);
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
      if (err) return evtCallback(dbErrors(err), null);
      console.log('coaches:\n', coach.groups);

      updateTeamGroup(upGroup);
    });
  }

  function updateTeamGroup(upGroup) {
    console.log('updateTeamGroup');

    var cond = {school: upGroup.sess.school, name: upGroup.team.name, gender: upGroup.team.gender, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('team:\n', team.groups);

      updateAthleteGroup(upGroup);
    });
  }

  function updateAthleteGroup(upGroup) {
    console.log('updateAthleteGroup');

    var cond = {school: upGroup.sess.school, "coaches.username": upGroup.sess.username, "coaches.name": upGroup.sess.name, "groups.name": upGroup.oldGroup};
    var update = {$set: {'groups.$.name': upGroup.newGroup}};
    upGroup.Mods.Athletes.update(cond, update, {multi: true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
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
      if (err) return evtCallback(dbErrors(err), null);
      console.log('coach:\n', coach.groups);

      return insertTeamGroup(newGroup);
    });
  }

  function insertTeamGroup(newGroup) {
    console.log("insertTeamGroup");

    var cond = {school: newGroup.sess.school, name: newGroup.team.name, gender: newGroup.team.gender};
    var update = {$push: {groups: {_id: newGroup.doc._id, name: newGroup.doc.name}}};
    newGroup.Mods.Teams.findOneAndUpdate(cond, update, function(err, team) {
      if (err) return evtCallback(dbErrors(err), null);
      console.log('team:\n', team.groups);

      return evtCallback(null, newGroup.doc);
    });
  }
}

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
}

module.exports = exports = trainingAdminOps;