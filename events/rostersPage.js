;"use strict";
/*
  EVENTS: rostersPage
 */

var rospgOps = require('../operations').RostersPageOps;

var rostersPageEvts = {

  getRostersPage: function(req, res, next) {
    console.log('Event: getRostersPage');

    rospgOps.getRostersPage(req, function(err, payLoad) {
      if (err) throw new Error(err);

      // console.log('payLoad:', payLoad);
      res.send(payLoad);
      // res.render('rostersPage', {
      //   nav: req.school,
      //   athletes: payLoad.athletes,
      //   apeLib: payLoad.apeLibPackage
      // });
    });
  },

  createTeam: function(req, res, next) {
    console.log('Event: createTeam');

    rospgOps.createTeam(req, function(err) {
      if (err) {
        console.error("createTeam: Error\n", err);
        res.send(500, "Problem saving team");
      } else {
        console.log('createTeam: Success');
        res.send(200);
      }
    })
  },

  updateTeam: function(req, res, next) {
    console.log('Event: updateTeam');

    rospgOps.updateTeam(req, function(err) {
      if (err) {
        console.error("updateTeam: Error:\n", err);
        res.send(500, "Problem updating team");
      } else {
        console.log('updateTeam: Success');
        res.send(200);
      }
    });
  },

  deleteTeam: function(req, res, next) {
    console.log('Event: deleteTeam');

    rospgOps.deleteTeam(req, function(err) {
      if (err) {
        console.error("deleteTeam: Error:\n", err);
        res.send(500, "Problem deleteing team");
      } else {
        console.log('deleteTeam: Success');
        res.send(200);
      }
    });
  }

}

module.exports = exports = rostersPageEvts;