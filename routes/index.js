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
  , rosEvts = require('../events').RostersPageEvts;

module.exports = function(app) {
  // Home

  app.get('/', function(req, res) {
    res.redirect('/teams'); // should redirect to login
  });

  // Login
  // app.get('/login', loginEvts.displayLogin);
  // app.post('/login', sanitize, authenticate, authorize, redirect);

  // Logout
  // app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

  // Rosters Page
  app.get('/:school/:team/:gender/roster', rosEvts.getRostersPage);
  app.post('/:school/:team/:gender/:group', function(req, res, next) {
    console.log(req.body.params);
    res.send(200, req.body.params);
  });
  // app.put();
  // app.delete();


  // Teams Page
  app.get('/:school/teams', tmEvts.getTeamsPage);
  // app.post('/:school/:team/:gender', tmEvts.createTeam);
  // app.put('/:school/:team/:gender', tmEvts.updateTeam);
  app.put('/:school/:team/:gender', function(req, res) {
    console.log('putter');
    console.log(req.body);
  });
  app.delete('/:school/:team/:gender', tmEvts.deleteTeam);

}