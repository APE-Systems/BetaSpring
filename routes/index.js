;"use strict";
var mid = require('../middleware').middle
  , gbl = require('../middleware').globals
  , controllers = require('../controllers')
  , user = controllers.User
  , athlete = controllers.Athlete
  , metrics = controllers.Metrics
  , teams = controllers.Teams

  , fs = require('fs')
  , tmEvts = require('../events').TeamsPageEvts
  , rosEvts = require('../events').RostersPageEvts
  , trnEvts = require('../events').TrainingPageEvts
  , trnAdmEvts = require('../events').TrainingAdminEvts
  , apeLibEvts = require('../events').ApeLibEvts;



module.exports = function(app) {
  //Home
  app.get('/', function(req, res) {
    res.redirect('/teams'); // should redirect to login
  });

  //Login
  // app.get('/login', loginEvts.displayLogin);
  // app.post('/login', sanitize, authenticate, authorize, redirect);

  //Logout
  // app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

//Teams Page
  app.get('/:school/teams', tmEvts.getTeamsPage);
  
    //TEAMS
  app.post('/:school/teams/:team-:gender', tmEvts.createTeam);
  app.put('/:school/:team-:gender', tmEvts.updateTeam);
  app.delete('/:school/:team-:gender', tmEvts.deleteTeam);

//Rosters Page
  app.get('/:school/:team-:gender/roster', rosEvts.getRostersPage);

    //ATHLETES
  app.post('/:school/:team-:gender/roster/athlete', rosEvts.createAthlete);
  app.put('/:school/:team-:gender/roster/athlete/:id', rosEvts.updateAthlete);
  app.delete('/:school/:team-:gender/roster/athlete/:id', rosEvts.deleteAthlete);

    //GROUPS
  app.post('/:school/:team-:gender/roster/group/:group', rosEvts.createGroup);
  app.put('/:school/:team-:gender/roster/group/:oldGroup', rosEvts.updateGroup);
  app.delete('/:school/:team-:gender/roster/group/:group', rosEvts.deleteGroup);

    //ATHLETES + GROUPS
  app.post('/:school/:team-:gender/roster/group/:id/pushathletes', rosEvts.pushAthletesToGroups);
  app.post('/:school/:team-:gender/roster/group/:id/pullathletes', rosEvts.pullAthletesFromGroups);

//Training Page
  app.get('/:school/:team-:gender/training', trnEvts.getTrainingPage);
    //SELECTIONS
  app.get('/:school/:team-:gender/training/group/:grp/metriccat/:mcat', trnEvts.onSelection);

//Training Admin
  app.get('/:school/:team-:gender/training/admin', trnAdmEvts.getTrainingAdmin);
    //METRICCATS
  app.post('/:school/:team-:gender/training/admin/metriccat', trnAdmEvts.createMetricCat);
  // app.put();
  app.delete('/:school/:team-:gender/training/admin/metriccat/:mcat', trnAdmEvts.deleteMetricCat);

  //   //METRICS
  // app.post();
  // app.put();
  // app.delete();

  //   //METRICCATS + METRICS
  // app.post();

//APE Library
    //Drag'N Drop
  // app.post('/:school/apelibrary/:mtrcat/:metric/:teamTgt-:genderTgt', apeLibEvts.metricCatMetricToTeam);
  // app.post('/:school/apelibrary/:mtrcat/:teamTgt-:genderTgt', apeLibEvts.metricCatToTeam);
  // app.post('/:school/apelibrary/:metric/:teamTgt-:genderTgt', apeLibEvts.metricToTeam);

    //CRUD
  // app.post('/:school/apelibrary/:teamSrc-:genderSrc/:mtrcat/:metric/:teamTgt-:genderTgt', apeLibEvts.metricCatMetricToTeam);
  // app.post('/:school/apelibrary/:teamSrc-:genderSrc/:mtrcat/:teamTgt-:genderTgt', apeLibEvts.metricCatToTeam)
  // app.post('/:school/apelibrary/:teamSrc-:genderSrc/:metric/:teamTgt-:genderTgt', apeLibEvts.metricToTeam)

}

// -------------------------------------------------------------------------- //
//  APE LIBRARY URI TO SUPPORT CRUD
// -------------------------------------------------------------------------- //
/*
    

  app.post('/:school/apelibrary/metriccategory-:mtrcat', apeLibEvts.createMetricCat);
  app.put('/:school/apelibrary/metriccateogry-:mtrcat', apeLibEvts.editMetricCat);
  app.delete('/:school/apelibrary/metriccateogry-:mtrcat', apeLibEvts.deleteMetricCat);

  app.post('/:school/apelibrary/metric-:metric', apeLibEvts.createMetric);
  app.put('/:school/apelibrary/metric-:metric', apeLibEvts.editMetric);
  app.delete('/:school/apelibrary/metric-:metric', apeLibEvts.deleteMetric);

// -------------------------------------------------------------------------- //

  app.post('/:school/apelibrary/:team-:gender/:mtrcat/:metric', apeLibEvts.createMetric);
  app.post('/:school/apelibrary/:team-:gender/metriccategory-:mtrcat', apeLibEvts.createMetricCat);
  app.put('/:school/apelibrary/:team-:gender/metriccategory-:mtrcat', apeLibEvts.editMetricCat);
  app.put('/:school/apelibrary/:team-:gender/metriccategory-:mtrcat/metric-:metric', apeLibEvts.editMetric);
  app.put('/:school/apelibrary/:team-:gender/metric-:metric', apeLibEvts.editMetric);
  app.post('/:school/apelibrary/:team-:gender/:metric', apeLibEvts.createMetric);\
  app.put('/:school/apelibrary/:team-:gender/:mtrcat/:metric', apeLibEvts.editMetric);
  app.delete('/:school/apelibrary/:team-:gender/:mtrcat/:metric', apeLibEvts.deleteMetric);
  app.delete('/:school/apelibrary/:team-:gender/:mtrcat', apeLibEvts.deleteMetricCat);
  app.delete('/:school/apelibrary/:team-:gender/:metric', apeLibEvts.deleteMetric);
  */
// -------------------------------------------------------------------------- //
// -------------------------------------------------------------------------- //
