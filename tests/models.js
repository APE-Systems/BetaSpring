var Coaches = require('../models').Coaches
  , Schools = require('../models').Schools
  , Models = require('../models').models;

module.exports = function(app) {

  // -- MODEL TESTING --//

  //generic
  app.get('/', function(req, res) {
    Models('universityofsoutherncalifornia', function(err, Models) {
      Models.Teams.find({}, function(err, teams) {
        console.log(teams);
      });
    });
  });

// get schools
  app.get('/test/:school', function(req, res) {
    var school = req.params.school;
    Schools.findOne({name: school}, function(err, school) {
      if (err) throw new Error(err);
      res.set('Content-Type', 'application/json');
      res.json(200, school);
    });
  });//END school testing

  // get teams
  app.get('/test/:school/teams', function(req, res) {
    var skool = req.params.school;
    Schools.findOne({name: skool}, function(err, school) {
      if (err) throw new Error(err);
      var schName = formatSchool(school.name);
      Models(schName, function(err, Models) {
        if (err) throw new Error(err);
        Models.Teams.find({}, function(err, teams) {
          if (err) throw new Error(err);
          res.json(200, teams);
        });
      });
    });
  });//END teams testing

  // get athletes
  app.get('/test/:school/teams/athletes', function(req, res) {
    var skool = req.params.school;
    Schools.findOne({name: skool}, function(err, school) {
      if (err) throw new Error(err);
      var schName = formatSchool(school.name);
      Models(schName, function(err, Models) {
        if (err) throw new Error(err);
        Models.Athletes.find({}, function(err, athletes) {
          if (err) throw new Error(err);
          res.json(200, {count: athletes.length, athletes: athletes});
        });
      });
    });
  });//END athletes testing

  // get metric categories
  app.get('/test/:school/teams/mtrcats', function(req, res) {
    var skool = req.params.school;
    Schools.findOne({name: skool}, function(err, school) {
      if (err) throw new Error(err);
      var schName = formatSchool(school.name);
      Models(schName, function(err, Models) {
        if (err) throw new Error(err);
        Models.MetricCats.find({}, function(err, mtrcats) {
          if (err) throw new Error(err);
          res.json(200, {count: mtrcats.length, mtrCats: mtrcats});
        });
      });
    });
  });//END metric categories testing

  // get metrics
  app.get('/test/:school/teams/metrics', function(req, res) {
    var skool = req.params.school;
    Schools.findOne({name: skool}, function(err, school) {
      if (err) throw new Error(err);
      var schName = formatSchool(school.name);
      Models(schName, function(err, Models) {
        if (err) throw new Error(err);
        Models.Metrics.find({}, function(err, metrics) {
          if (err) throw new Error(err);
          res.json(200, {count: metrics.length, Metrics: metrics});
        });
      });
    });
  });//END metric testing

  // get athmetrics
  app.get('/test/:school/teams/athmetrics', function(req, res) {
    var skool = req.params.school;
    Schools.findOne({name: skool}, function(err, school) {
      if (err) throw new Error(err);
      var schName = formatSchool(school.name);
      Models(schName, function(err, Models) {
        if (err) throw new Error(err);
        Models.Athmetrics.find({}, function(err, athmetrics) {
          if (err) throw new Error(err);
          res.json(200, {count: athmetrics.length, athMetrics: athmetrics});
        });
      });
    });
  });

  // MODEL TESTING HANDLERS

  function formatSchool(school) {
    return school.toLowerCase().replace(/\s/g, '');
  }

  // -- END MODEL TESTING -- //
}