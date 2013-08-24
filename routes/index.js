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
    res.redirect('/login');
  });

  // Sign up
  app.get('/signup', function(req, res) {
    res.render('signup');
  });
  app.post('/signup', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Under Construction');
    res.end();
  });

  // Login
  app.get('/login', mid.checkCookie, mid.checkSession, mid.redirect);
  app.post('/login', mid.validate, mid.authenticate, mid.setSession, user.dashboard);

  // Logout
  app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

  // Dashboard
  app.get('/:school/dashboard', mid.checkCookie, mid.checkSession, user.dashboard);

  // Training
  app.get('/:school/training', mid.checkCookie, mid.checkSession, gbl.loadModels, user.training);

  // Rosters
  app.get('/:school/rosters', mid.checkCookie, mid.checkSession, gbl.loadModels, user.rosters);
    // athlete profile

  // Profile
  app.get('/:school/rosters/athlete/:id', mid.checkCookie, mid.checkSession, gbl.loadModels, athlete.profile);

  // AJAX
    // select an athlete
  app.get('/:school/athlete/:id', mid.checkCookie, mid.checkSession, gbl.loadModels, athlete.get);
    // fetch Chart
  app.get('/:school/rosters/athlete/:id/:metric/:el', mid.checkCookie, mid.checkSession, gbl.loadModels, athlete.getChart);

  // Routes required for training page
  app.get('/categories/:category/metrics', mid.checkCookie, mid.checkSession, gbl.loadModels, metrics.index);
  app.post('/athletes/:id/metrics', mid.checkCookie, mid.checkSession, gbl.loadModels, metrics.create);
  app.delete('/athletes/:id/metrics/latest', mid.checkCookie, mid.checkSession, gbl.loadModels, metrics.destroy);
  app.get('/teams/:team/metrics/latest', mid.checkCookie, mid.checkSession, gbl.loadModels, teams.index);

  // 404
  app.get('/whoops', function(req, res) {
    res.render('whoops');
  });

  // Internal Errors
  app.get('/internal_error/:where/:errCode/', function(req, res) {
    res.render('errors/internalError', {
      where: req.params.where,
      error: req.params.errCode
    });
  });

};
