<<<<<<< HEAD
"use strict";function propagateGroupDelete(e,t){function n(e){console.log("deleteCoachGroup");var n={school:e.sess.school,"groups.name":e.name},i={$pull:{groups:{name:e.name}}};e.Mods.Coaches.update(n,i,function(n,i){if(n)return t(n,null);console.log("coach:\n",i);r(e);return})}function r(e){console.log("deleteTeamGroup");var n={school:e.sess.school,name:e.team.name,gender:e.team.gender,"groups.name":e.name},r={$pull:{groups:{name:e.name}}};e.Mods.Teams.update(n,r,function(n,r){if(n)return t(n,null);console.log("team:\n",r);i(e);return})}function i(e){console.log("deleteAthleteGroup");var n={school:e.sess.school,team:e.team,"groups.name":e.name},r={$pull:{groups:{name:e.name}}};e.Mods.Athletes.update(n,r,{multi:!0},function(n,r){if(n)return t(n,null);console.log("athlete:\n",r);return t(null,e.doc)})}console.info("propagating delGroup");n(e)}function propagateGroupUpdate(e,t){function n(e){console.log("updateCoachGroup");var n={school:e.sess.school,"groups.name":e.oldGroup},i={$set:{"groups.$.name":e.newGroup}};e.Mods.Coaches.findOneAndUpdate(n,i,function(n,i){if(n)return t(n,null);console.log("coaches:\n",i.groups);r(e)})}function r(e){console.log("updateTeamGroup");var n={school:e.sess.school,name:e.team.name,gender:e.team.gender,"groups.name":e.oldGroup},r={$set:{"groups.$.name":e.newGroup}};e.Mods.Teams.findOneAndUpdate(n,r,function(n,r){if(n)return t(n,null);console.log("team:\n",r.groups);i(e)})}function i(e){console.log("updateAthleteGroup");var n={school:e.sess.school,"coaches.username":e.sess.username,"coaches.name":e.sess.name,"groups.name":e.oldGroup},r={$set:{"groups.$.name":e.newGroup}};e.Mods.Athletes.update(n,r,{multi:!0},function(n,r){if(n)return t(n,null);console.log("athletes:",r);t(null,e.doc)})}console.info("propagating upGroup");n(e)}function propagateGroupCreate(e,t){function n(e){console.log("insertCoachGroup");var n={school:e.sess.school,username:e.sess.username,"teams.name":e.team.name,"teams.gender":e.team.gender},i={$push:{groups:{_id:e.doc._id,name:e.doc.name}}};e.Mods.Coaches.findOneAndUpdate(n,i,function(n,i){if(n)return t(n,null);console.log("coach:\n",i.groups);return r(e)})}function r(e){console.log("insertTeamGroup");var n={school:e.sess.school,name:e.team.name,gender:e.team.gender},r={$push:{groups:{_id:e.doc._id,name:e.doc.name}}};e.Mods.Teams.findOneAndUpdate(n,r,function(n,r){if(n)return t(n,null);console.log("team:\n",r.groups);return t(null,e.doc)})}console.info("propagating newGroup");return n(e)}function validateInput(e,t){console.log("Operations: validateInput");var n=45,r=/^[_]*[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/;if(n===e.length){console.info("Validation: Error\n");var i={name:"ValidationError",msg:"Input exceeds number of characaters allowed",code:422};return t(i,null)}if(!r.test(e)){console.info("Validation: Error\n");var i={name:"ValidationError",msg:"Not valid input",code:422};return t(i,null)}console.info("Validation: Success\n");return t(null,e)}function getAthletes(e,t){var n={},r=e.models,i=e.sess.school,s={name:e.params.team,gender:e.params.gender},o=e.sess.username,u={school:i,team:s,"coaches.username":o},a={name:1,positions:1,years:1,metrics:1};r.Athletes.find(u,a,function(e,r){e&&t(e,null);n.athletes=r;t(n)})}function getAPElib(e){return function(t){var n={},r={},i={name:1,metrics:1};APE.MetricCats.find(r,i,function(r,i){r&&e(r,null);n.mtrcats=i;APE.Metrics.find({"mtrcats.name":{$exists:!1}},{name:1},function(r,i){r&&e(r,null);n.metrics=i;t.apeLibPackage=n;return e(null,t)})})}}var APE=require("../models/db/config").apeMods,rostersPageOps={getRostersPage:function(e,t){console.log("Operation: getRostersPage");getAthletes(e,getAPElib(t))},createAthlete:function(e,t){console.log("Operation: createAthlete");var n={name:e.params.team,gender:e.params.gender},r=e.school,i=e.models,s=new i.Athletes;s.createdBy=e.sess.COID;s.school=r;s.name=e.body.name;s.gender=e.body.gender;s.save(function(e){t(e)})},updateAthlete:function(e,t){console.log("Operation: updateTeam");var n=e.models,r=e.school,i={name:e.params.team},s={name:e.body.name,gender:e.body.gender};n.Teams.findOneAndUpdate(i,s,function(e,n){e&&t(e);console.log("teamUpdate:",s);t(null)})},deleteAthlete:function(e,t){console.log("Operation: deleteTeam");var n=e.models,r=e.school;n.Teams.findOneAndRemove(cond,function(e,n){e&&t(e);console.log("teamDelete:",n);t(null)})},createGroup:function(e,t){function n(n,r){if(n)return t(n,null);var i={name:e.params.group,team:{name:e.params.team,gender:e.params.gender},sess:e.sess,Mods:e.models},s=new i.Mods.Groups;s.createdBy=i.sess.COID;s.school=i.sess.school;s.team=i.team;s.name=i.name;console.log("create ",s.name);s.save(function(e){if(e)return t(e,null);console.log("crGroup:",s.name);i.doc=s;propagateGroupCreate(i,t)})}console.log("Operation: createGroup");validateInput(e.params.group,n)},updateGroup:function(e,t){function n(n,r){if(n)return t(n,null);var i={newGroup:e.body.upName,oldGroup:e.params.oldGroup,team:{name:e.params.team,gender:e.params.gender},sess:e.sess,Mods:e.models};console.log("replace "+i.oldGroup+" with "+i.newGroup);var s={school:i.sess.school,team:i.team,name:i.oldGroup},o={$set:{name:i.newGroup}};i.Mods.Groups.findOneAndUpdate(s,o,function(e,n){if(e)return t(e,null);console.log("upGroup:\n",n.name);i.doc=n;propagateGroupUpdate(i,t)})}console.log("Operation: updateGroup");validateInput(e.params.oldGroup,n)},deleteGroup:function(e,t){function n(n,r){if(n)return t(n,null);var i={name:e.params.group,team:{name:e.params.team,gender:e.params.gender},sess:e.sess,Mods:e.models};console.log("delete "+i.name);var s={school:i.sess.school,team:i.team,name:i.name};i.Mods.Groups.findOneAndRemove(s,function(e,n){if(e)return t(e,null);console.log("delGroup:\n",n);i.doc=n;propagateGroupDelete(i,t)})}console.log("Operation: deleteGroup");validateInput(e.params.group,n)}};module.exports=exports=rostersPageOps;
=======
;"use strict";
/*
  OPERATIONS: rostersPage
 */

var APE = require('../models/db/config').apeMods;

var rostersPageOps = {

  getRostersPage: function(req, evtCallback) {
    console.log('Operation: getRostersPage');
    getAthletes(req, getAPElib(evtCallback));
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
        if (err) return evtCallback(err, null);
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

    return validateUpdateAthleteInput(athlete, checkForNameDiff);

    function checkForNameDiff(err, athlete) {
      if (err) return evtCallback(err, null);
      console.log('checking for name changes');

      var query = {
        _id: athlete._id,
        name: athlete.fname + ' ' + athlete.lname,
        position: athlete.position,
        year: athlete.year,
        hometown: athlete.city + ", " + athlete.state,
        height: athlete.height
      };

      req.models.Athletes.findOne({_id: query._id, name: query.name}, function(err, ath) {
        if (err) return evtCallback(err, null);

        if (ath) {
        console.log('no name change');
        return checkForAttributeDiff(query, athlete);
        }

        return addEditsAndPropagate(query, athlete);
      });
    }

    function checkForAttributeDiff(query, athlete) {
      console.log('checking for attribute changes');

      //if athlete found, then do not propagate change
      req.models.Athletes.findOne(query, function(err, ath) {
        if (err) return evtCallback(err, null);

        if (ath) {
          console.log('athlete found: no edits\n', ath);
          return evtCallback(null, ath);
        }

        return addEdits(query, athlete);
      });
    }

    function addEdits(update, athlete) {
      console.log('adding athletes edits without propagating');
      delete update['_id'];

      req.models.Athletes.update({_id: athlete._id}, update, function(err, numUp) {
        if (err) return evtCallback(err, null);
        console.log('athlete updated:\n', numUp);

        return evtCallback(null, athlete);
      });
    }

    function addEditsAndPropagate(update, athlete) {
      console.log('adding athletes edits');
      var upAthlete = {
        team: {name: req.params.team, gender: req.params.gender},
        sess: req.sess,
        Mods: req.models
      };
      delete update['_id'];

      upAthlete.Mods.Athletes.update({_id: athlete._id}, update, function(err, numUp) {
        if (err) return evtCallback(err, null);
        console.log('athlete updated:\n', numUp);

        upAthlete.athlete = athlete;
        return propagateAthleteUpdate(upAthlete, evtCallback);
      });
    }
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
        Mods: req.models
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

function propagateAthleteUpdate(upAthlete, evtCallback) {
  console.info('propagating upAthlete');
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

  return callback(null, athlete);

  function valError(input) {
    console.info("Validation: Error\n");
    var err = {name: "ValidationError", msg: 'Not valid input', code: 422, value: input};
    return callback(err, null);
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

    var update = {$pull: {groups: {name: delGroup.name}}};
    delGroup.Mods.Coaches.update(cond, update, function(err, numUp) {
      if (err) return callback(err, null);

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

    var update = {$pull: {groups: {name: delGroup.name}}};
    delGroup.Mods.Teams.update(cond, update, function(err, numUp) {
      if (err) return callback(err, null);

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

    var update = {$pull: {groups: {name: delGroup.name}}};
    delGroup.Mods.Athletes.update(cond, update, {multi:true}, function(err, numUp) {
      if (err) return callback(err, null);

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

function getAthletes(req, callback) {
  var dataLoad = {};
  var Mods = req.models;
  var school = req.sess.school;
  var team = {
    name: req.params.team,
    gender: req.params.gender
  };
  var username = req.sess.username;
  var query = {school: school, team: team, 'coaches.username': username };
  var proj = {name:1, positions:1, years:1, metrics:1};

  Mods.Athletes.find(query, proj, function(err, athletes) {
    if (err) callback(err, null);
    // console.log('athletes:\n', athletes);
    dataLoad.athletes = athletes;
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

module.exports = exports = rostersPageOps;
>>>>>>> cc1bdc043bc2441cb153f81fe90b520fba255ddd