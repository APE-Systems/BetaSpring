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
  app.post('/:school/:team-:gender', tmEvts.createTeam);
  app.put('/:school/:team-:gender', tmEvts.updateTeam);
  app.delete('/:school/:team-:gender', tmEvts.deleteTeam);

  //APE Library
    //Drag'N Drop
  app.post('/:school/apelibrary/:mtrcat/:metric/:teamTgt-:genderTgt', apeLibEvts.metricCatMetricToTeam);
  app.post('/:school/apelibrary/:mtrcat/:teamTgt-:genderTgt', apeLibEvts.metricCatToTeam);
  app.post('/:school/apelibrary/:metric/:teamTgt-:genderTgt', apeLibEvts.metricToTeam);

  // app.post('/:school/apelibrary/:teamSrc-:genderSrc/:mtrcat/:metric/:teamTgt-:genderTgt', apeLibEvts.metricCatMetricToTeam);
  // app.post('/:school/apelibrary/:teamSrc-:genderSrc/:mtrcat/:teamTgt-:genderTgt', apeLibEvts.metricCatToTeam)
  // app.post('/:school/apelibrary/:teamSrc-:genderSrc/:metric/:teamTgt-:genderTgt', apeLibEvts.metricToTeam)

  // Rosters Page

  app.get('/:school/:team/:gender/roster', function(req, res) {
    var payload = {
    "athletes": [
        {
            "_id": "522cec1f246c894011000027",
            "name": "Sean Adler",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000028",
            "name": "Carl Aguirre",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100002b",
            "name": "Trent Boras",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100002c",
            "name": "Vahn Bozoian",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100002d",
            "name": "Kevin Chambers",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100002e",
            "name": "Turner Clouse",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100002f",
            "name": "Omar Cotto",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000030",
            "name": "Kyle Davis",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000031",
            "name": "David Edson",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000033",
            "name": "Shane Gonzales",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000034",
            "name": "James Guillen",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000035",
            "name": "Kaz Halcovich",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000036",
            "name": "Jake Hernandez",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000037",
            "name": "Marc Huberman",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000038",
            "name": "Brooks Kriske",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000039",
            "name": "Blake Lacey",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100003a",
            "name": "Adam Landecker",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100003b",
            "name": "Ian McCarthy",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100003c",
            "name": "Matthew Munson",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100003d",
            "name": "Nigel Nootbaar",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100003e",
            "name": "Andre Ramirez",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100003f",
            "name": "Kyle Richter",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000040",
            "name": "James Roberts",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000041",
            "name": "Timothy Robinson",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000042",
            "name": "Sean Silva",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000043",
            "name": "Reginald Southall",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000045",
            "name": "Wyatt Strahan",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000046",
            "name": "Garrett Stubbs",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000047",
            "name": "Conner Sullivan",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000048",
            "name": "Kevin Swick",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100004a",
            "name": "Bobby Wheatley",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100004b",
            "name": "Brent Wheatley",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100004c",
            "name": "Gregory Zebrack",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000029",
            "name": "JR Aguirre",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c89401100002a",
            "name": "Nick Berhel",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000032",
            "name": "Dante Flores",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000044",
            "name": "Bobby Stahel",
            "metrics": [],
            "years": [],
            "positions": []
        },
        {
            "_id": "522cec1f246c894011000049",
            "name": "Kyle Twomey",
            "metrics": [],
            "years": [],
            "positions": []
        }
    ],
    "apeLibPackage": {
        "mtrcats": [
            {
                "_id": "522a1c76303c47cc1500001d",
                "name": "strength",
                "metrics": [
                    {
                        "_id": "522bd1363922848c06000025",
                        "name": "Clean Deadlift 1RM"
                    },
                    {
                        "_id": "522bd1363922848c06000026",
                        "name": "Back Squat 1RM"
                    },
                    {
                        "_id": "522bd1363922848c06000023",
                        "name": "Clean 1RM"
                    },
                    {
                        "_id": "522bd1363922848c06000024",
                        "name": "Hang Snatch 1RM"
                    }
                ]
            },
            {
                "_id": "522d289a2a23a3b810000027",
                "name": "bio",
                "metrics": [
                    {
                        "_id": "522e2784e965f46c0a00002e",
                        "name": "Height"
                    },
                    {
                        "_id": "522e2784e965f46c0a00002a",
                        "name": "Body Fat"
                    },
                    {
                        "_id": "522e2784e965f46c0a000027",
                        "name": "Weight"
                    }
                ]
            },
            {
                "_id": "522d289a2a23a3b810000028",
                "name": "fms",
                "metrics": [
                    {
                        "_id": "522e2784e965f46c0a000037",
                        "name": "Hurdle Step"
                    },
                    {
                        "_id": "522e2784e965f46c0a000033",
                        "name": "Deep Squat"
                    },
                    {
                        "_id": "522e2784e965f46c0a000038",
                        "name": "Rot Stability"
                    },
                    {
                        "_id": "522e2784e965f46c0a000030",
                        "name": "ASLR"
                    },
                    {
                        "_id": "522e2784e965f46c0a000029",
                        "name": "IL Lunge"
                    },
                    {
                        "_id": "522e2784e965f46c0a00002c",
                        "name": "SH Mob"
                    },
                    {
                        "_id": "522e2784e965f46c0a000034",
                        "name": "Stability PU"
                    }
                ]
            },
            {
                "_id": "522d289a2a23a3b810000029",
                "name": "strength",
                "metrics": [
                    {
                        "_id": "522e2784e965f46c0a000031",
                        "name": "Hang Clean Shrug"
                    },
                    {
                        "_id": "522e2784e965f46c0a00002d",
                        "name": "Hang Clean"
                    },
                    {
                        "_id": "522e2784e965f46c0a000035",
                        "name": "Front Squat"
                    }
                ]
            },
            {
                "_id": "522d289a2a23a3b81000002a",
                "name": "power",
                "metrics": [
                    {
                        "_id": "522e2784e965f46c0a000036",
                        "name": "Medicine Ball"
                    },
                    {
                        "_id": "522e2784e965f46c0a000032",
                        "name": "Vertical Jump"
                    }
                ]
            },
            {
                "_id": "522d289a2a23a3b81000002b",
                "name": "speed",
                "metrics": [
                    {
                        "_id": "522e2784e965f46c0a00002b",
                        "name": "30 YD Sprint"
                    },
                    {
                        "_id": "522e2784e965f46c0a00002f",
                        "name": "300 YD Shuttle"
                    },
                    {
                        "_id": "522e2784e965f46c0a000028",
                        "name": "Pro Agility"
                    }
                ]
            }
        ],
        "metrics": [
            {
                "_id": "523dafca7f3fff94d940a7a7",
                "name": "BMI"
            }
        ]
    }
  };
  payload.nav = 'University of Southern California';
  res.render('rostersPage', payload);
  });
  app.post('/:school/:team/:gender/:group', function(req, res, next) {
    console.log(req.body.params);
    res.send(200, req.body.params);
    req.flash('info', 'Group created');
  });
  // app.put();
  // app.delete();

    //ATHLETES
  app.get('/:school/:team-:gender/roster/athletes', rosEvts.getRostersPage);
  app.post('/:school/:team-:gender/roster/athlete', rosEvts.createAthlete);
  app.put('/:school/:team-:gender/roster/athlete/:athlete', rosEvts.updateAthlete);
  app.delete('/:school/:team-:gender/roster/athlete/:athlete', rosEvts.deleteAthlete);

    //GROUPS
  app.post('/:school/:team-:gender/roster/group/:group', rosEvts.createGroup);
  app.put('/:school/:team-:gender/roster/group/:oldGroup', rosEvts.updateGroup);
  app.delete('/:school/:team-:gender/roster/group/:group', rosEvts.deleteGroup);


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
