var mid = require('../middleware').middle
  , gbl = require('../middleware').globals
  , controllers = require('../controllers')
  , user = controllers.User
  , athlete = controllers.Athlete
  , metrics = controllers.Metrics
  , teams = controllers.Teams;

module.exports = function(app) {

  // Home
  app.get('/', function(req, res) {
    res.redirect('/teams'); // should redirect to login
  });

  // Login
  app.get('/login', mid.checkCookie, mid.checkSession, mid.redirect);
  app.post('/login', mid.validate, mid.authenticate, mid.setSession, user.dashboard);

  // Logout
  app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

  // Teams Page
  app.get('/teams', function(req, res, next) {
    res.render('teams');
  });

};
