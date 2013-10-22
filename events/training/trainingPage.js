;"use strict";
/*
  EVENTS: trainingPage
 */

var trnpgOps = require('../../operations').TrainingPageOps;

var trainingPageEvts = {

  getTrainingPage: function(req, res, next) {
    console.log('Event: getTrainingPage');

    trnpgOps.getTrainingPage(req, function(err, payload) {
      if (err) {
        console.error("getTrainingPage: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: {
              team: req.params.team,
              gender: req.params.gender
            }
          }
        });
      } else {
        console.log('getTrainingPage: Success');
        res.json(200, {
          nav: req.sess.school,
          athletes: payload.team.athletes,
          groups: payload.team.groups,
          metricCat: payload.team.mtrcats,
          athmetrics: payload.athmetrics
        });
      }
    });
  },

  onSelection: function(req, res, next) {
    console.log('Event: onSelection');

    trnpgOps.createAthlete(req, function(err, athlete) {
      if (err) {
        console.log("onSelection: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.body
          }
        });
      } else {
        console.log('onSelection: Success\n');
        // res.json(200, {
        //   group: ,
        //   mtrcats: ,
        //   athletes: ,
        //   athmetrics: 
        // });
      }
    });
  },

  onCatSelection: function(req, res, next) {
    console.log('Event: updateAthlete');

    rospgOps.updateAthlete(req, function(err, athlete) {
      if (err) {
        console.log("updateAthlete: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('updateAthlete: Success\n');
        res.json(200, {id: athlete._id, name: athlete.name});
      }
    });
  },

  onMetricSelection: function(req, res, next) {
    console.log('Event: deleteAthlete');

    rospgOps.deleteAthlete(req, function(err) {
      if (err) {
        console.log("deleteAthlete: Error\n", err.name);
        res.json(err.rescode, {
          error: {
            id: err.id,
            msg: err.msg,
            value: req.params.id
          }
        });
      } else {
        console.log('deleteAthlete: Success');
        res.send(204);
      }
    });
  }

}

module.exports = exports = trainingPageEvts;