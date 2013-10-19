;"use strict";
/*
  OPERATIONS: rostersPage
 */

var APE = require('../models/db/config').apeMods;
var dbErrors = require('./errors.js').dbErrors;
var cliErrors = require('./errors.js').cliErrors;

var rostersPageOps = {

  getRostersPage: function(req, evtCallback) {
    console.log('Operation: getRostersPage');

    var pgload = {
      team: {
        name: req.params.team,
        gender: req.params.gender
      },
      sess: req.sess,
      Mods: req.models
    };
    var dataLoad = {};

    return checkTeamExistence(pgload, getAthletesAndGroups);

    function checkTeamExistence(pgload, callback) {
      var query = {name: pgload.team.name, gender: pgload.team.gender};
      pgload.Mods.Teams.findOne(query, function(err, team) {
        if (err) return evtCallback(dbErrors(err), null);

        if (!team)
          return evtCallback(cliErrors("notFound"), null);

        return callback(pgload);
      });
    }//END

    function getAthletesAndGroups(pgload) {
      var query = {school: pgload.sess.school, team: pgload.team};
      var proj = {name:1, position:1, year:1};

      pgload.Mods.Athletes.find(query, proj, function(err, athletes) {
        if (err) return evtCallback(dbErrors(err), null);

        dataLoad.athletes = athletes;
        return getTeamGroups(pgload);
      });
    }//END

    function getTeamGroups(pgload) {
      var query = {school: pgload.sess.school, name: pgload.team.name, gender: pgload.team.gender};
      var proj = {groups:1}

      pgload.Mods.Teams.findOne(query, proj, function(err, team) {
        if (err) return evtCallback(dbErrors(err));

        dataLoad.groups = team.groups;
        return getAPElib(pgload);
      });
    }//END

    function getAPElib(pgload) {
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
          dataLoad.apeLibPackage = apeLibPackage;
          // console.log('dataLoad\n', dataLoad);
          
          evtCallback(null, dataLoad);
          return;
        });
      });
    }//END
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

    return validateCreateAthleteInput(athlete, forgeAthlete);

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
      newAthlete.position = athlete.position;
      newAthlete.year = athlete.year;
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
        if (err) return evtCallback(dbErrors(err), null);
        console.log('Athlete saved:', newAthlete);

        crAthlete.athlete = newAthlete;
        return propagateAthleteCreate(crAthlete, evtCallback);
      });
    }
  },

  updateAthlete: function(req, evtCallback) {
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

  deleteAthlete: function(req, evtCallback) {
    console.log('Operation: deleteAthlete');
    var delAthlete = {
          _id: req.params.id,
          team: {name: req.params.team, gender: req.params.gender},
          sess: req.sess,
          Mods: req.models
        };
    var cond = {_id: delAthlete._id};


    function removeAthlete() { 
      delAthlete.Mods.Athletes.findOneAndRemove(cond, function(err, deldoc) {
        if (err) return evtCallback(dbErrors(err));

        if (!deldoc) {
          console.log("Athlete not found for deletion");
          var msg = {name:"DeleteAthlete" , msg:"Athlete not found", code: 404};
          return evtCallback(cliErrors("notFound"));
        }
        console.log('deleted athlete:', deldoc);
        delAthlete.athlete = deldoc;
        return propagateAthleteDelete(delAthlete, evtCallback);
      });
    }
  },

  createGroup: function(req, evtCallback) {
    console.log('Operation: createGroup');

    validateInput({name: req.params.group}, insertGroup);

    function insertGroup(err, group) {
      if (err) return evtCallback(err, null);

      var newGroup = {
        name: group.name,
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
        if (err) return evtCallback(dbErrors(err), null);
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
        if (err) return evtCallback(dbErrors(err), null);
      console.log('delGroup:\n', group);

      delGroup.doc = group;
      propagateGroupDelete(delGroup, evtCallback);
      });
    }
  },

  pushAthletesToGroups: function(req, evtCallback) {
    console.log("Operation: pushAthletesToGroups");

    var grpId = req.params.id;
    var athIds = req.body.athletes;
    var athct = 0;
    var grpct = 0;
    var athletes = [];

    return validateInput({val: grpId}, function(err, ok) {
      if (err) return evtCallback(err, null);
      return validateIds(athIds, addAthletesToGroup);
    });

    //TODO:
    //  check if athlete is in group before adding
    function addAthletesToGroup(err, input) {
      if (err) return evtCallback(err);
      console.log('add athletes to group');

      var info = {
        sess: req.sess,
        Mods: req.models
      }

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

  pullAthletesFromGroups: function(req, evtCallback) {
    console.log("Operation: pullAthletesFromGroups");

    var grpId = req.params.id;
    var athIds = req.body.athletes;
    var athletes = [];
    var athct = 0;
    var grpct = 0;

    return validateInput({val: grpId}, function(err, ok) {
      if (err) return evtCallback(err, null);
      return validateIds(athIds, removeAthletesFromGroup);
    });

    function removeAthletesFromGroup(err, input) {
      if (err) return evtCallback(err, null);
      console.log('removing athletes from group');

      var info = {
        sess: req.sess,
        Mods: req.models
      };
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

function propagateAthleteDelete(delAthlete, evtCallback) {
  console.info('propagating delAthlete');
  return removeSchoolAthlete();

  function removeSchoolAthlete() {
    console.log('deleting from school');
    var cond = {name: delAthlete.sess.school, "athletes._id": delAthlete.athlete._id};
    var update = {$pull: {athletes: {_id: delAthlete.athlete._id}}};

    // APE.Schools.findOne(cond, function(err, numUp) {
    APE.Schools.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('school:\n', numUp);

      // return evtCallback(null);
      return removeCoachAthlete(delAthlete);
    });
  }

  function removeCoachAthlete(delAthlete) {
    console.log('deleting from coach');
    var cond = {school: delAthlete.sess.school, "athletes._id": delAthlete.athlete._id};
    var update = {$pull: {athletes: {_id: delAthlete.athlete._id}}};

    // delAthlete.Mods.Coaches.findOne(cond, function(err, numUp) {
    delAthlete.Mods.Coaches.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('coach:\n', numUp);

      // return evtCallback(null);
      return removeTeamAthlete(delAthlete);
    });
  }

  function removeTeamAthlete(delAthlete) {
    console.log('deleting from team');
    var cond = {school: delAthlete.sess.school, name: delAthlete.team.name, gender: delAthlete.team.gender, "athletes._id": delAthlete.athlete._id};
    var update = {$pull: {athletes: {_id: delAthlete.athlete._id}}};

    // delAthlete.Mods.Teams.findOne(cond, function(err, numUp) {
    delAthlete.Mods.Teams.findOneAndUpdate(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('team:\n', numUp);

      // return evtCallback(null);
      return removeGroupAthlete(delAthlete);
    });
  }

  function removeGroupAthlete(delAthlete) {
    console.log('deleting from group');
    var cond = {school: delAthlete.sess.school, team: delAthlete.team, "athletes._id": delAthlete.athlete._id};
    var update = {$pull: {athltes: {_id: delAthlete.athlete._id}}};

    // delAthlete.Mods.Groups.find(cond, function(err, numUp) {
    delAthlete.Mods.Groups.update(cond, update, {multi: true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('group:\n', numUp);

      // return evtCallback(null);
      return removeMetricCatAthlete(delAthlete);
    });

  }

  function removeMetricCatAthlete(delAthlete) {
    //NOTE:
    //  index the conditional search
    console.log('deleting from metric category');
    var cond = {school: delAthlete.sess.school, team: delAthlete.team, "athletes._id": delAthlete.athlete._id};
    var update = {$pull: {athltes: {_id: delAthlete.athlete._id}}};

    // delAthlete.Mods.MetricCats.find(cond, function(err, numUp) {
    delAthlete.Mods.MetricCats.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('MetricCats:\n', numUp);

      // return evtCallback(null);
      return removeMetricAthlete(delAthlete);
    });
  }

  function removeMetricAthlete(delAthlete) {
    console.log('deleting from metrics');
    var cond = {school: delAthlete.sess.school, "athletes._id": delAthlete.athlete._id};
    var update = {$pull: {athltes: {_id: delAthlete.athlete._id}}};

    // delAthlete.Mods.Metrics.find(cond, function(err, numUp) {
    delAthlete.Mods.Metrics.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('Metrics:\n', numUp);

      // return evtCallback(null);
      return removeAthmetricAthlete(delAthlete);
    });
  }

  function removeAthmetricAthlete(delAthlete) {
    console.log('deleting from athmetrics');
    var cond = {school: delAthlete.sess.school, team: delAthlete.team, "athlete._id": delAthlete.athlete._id};
    var update = {$pull: {athltes: {_id: delAthlete.athlete._id}}};

    // delAthlete.Mods.Athmetrics.find(cond, function(err, numUp) {
    delAthlete.Mods.Athmetrics.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err));
      console.log('Athmetrics:\n', numUp);

      return evtCallback(null);
    });
  }
}

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

function propagateAthleteCreate(crAthlete, evtCallback) {
  console.info('propagating crAthlete');
  return insertSchoolAthlete(crAthlete);

  function insertSchoolAthlete(crAthlete) {
    console.log('insertSchoolAthlete');

    var cond = {name: crAthlete.sess.school, "coaches.username": crAthlete.sess.username, "teams.name": crAthlete.team.name, "teams.gender": crAthlete.team.gender};
    var update = {$push: {athletes: {_id: crAthlete.athlete._id, name: crAthlete.athlete.name}}};
    // APE.Schools.findOne(cond, function(err, numUp) {
    APE.Schools.update(cond, update, function(err, numUp) {
      if (err) return evtCallback(dbErrors(err), null);
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
      if (err) evtCallback(dbErrors(err), null);
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
      if (err) evtCallback(dbErrors(err), null);
      console.log('team:\n', numUp);

      return evtCallback(null, crAthlete.athlete);
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

function validateIds(val, callback) {
  console.log("Operations: validateIds");

  var val = val.replace(/[\["\] ]*/g, '').split(',');
  var maxCharLen = 35;
  var regId= /^[A-Z0-9][A-Z0-9]*$/i;

  for (var i=0; i<val.length; i++) {
    if (maxCharLen < val[i].length) {
      console.info("Validation: Error\n");
      return callback(cliErrors("maxCharacters"), null);
    }
    if (!regId.test(val[i])) {
      console.info("Validation: Error\n", val[i]);
      return callback(cliErrors("invalidIDval"), null);
    }
  }

  console.info("Validation: Success\n");
  return callback(null, val);
}//END

module.exports = exports = rostersPageOps;