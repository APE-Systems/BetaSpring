"use strict";var mid=require("../middleware").middle,gbl=require("../middleware").globals,controllers=require("../controllers"),user=controllers.User,athlete=controllers.Athlete,metrics=controllers.Metrics,teams=controllers.Teams,fs=require("fs"),tmEvts=require("../events").TeamsPageEvts,rosEvts=require("../events").RostersPageEvts,trnEvts=require("../events").TrainingPageEvts,trnAdmEvts=require("../events").TrainingAdminEvts,apeLibEvts=require("../events").ApeLibEvts;module.exports=function(e){e.get("/",function(e,t){t.redirect("/teams")});e.get("/:school/teams",tmEvts.getTeamsPage);e.post("/:school/teams/:team-:gender",tmEvts.createTeam);e.put("/:school/:team-:gender",tmEvts.updateTeam);e.delete("/:school/:team-:gender",tmEvts.deleteTeam);e.get("/:school/:team-:gender/roster",rosEvts.getRostersPage);e.post("/:school/:team-:gender/roster/athlete",rosEvts.createAthlete);e.put("/:school/:team-:gender/roster/athlete/:id",rosEvts.updateAthlete);e.delete("/:school/:team-:gender/roster/athlete/:id",rosEvts.deleteAthlete);e.post("/:school/:team-:gender/roster/group/:group",rosEvts.createGroup);e.put("/:school/:team-:gender/roster/group/:oldGroup",rosEvts.updateGroup);e.delete("/:school/:team-:gender/roster/group/:group",rosEvts.deleteGroup);e.post("/:school/:team-:gender/roster/group/:id/pushathletes",rosEvts.pushAthletesToGroups);e.post("/:school/:team-:gender/roster/group/:id/pullathletes",rosEvts.pullAthletesFromGroups);e.get("/:school/:team-:gender/training",trnEvts.getTrainingPage);e.get("/:school/:team-:gender/training/group/:grp/metriccat/:mcat",trnEvts.onSelection);e.get("/:school/:team-:gender/training/admin",trnAdmEvts.getTrainingAdmin);e.post("/:school/:team-:gender/training/admin/metriccat",trnAdmEvts.createMetricCat);e.delete("/:school/:team-:gender/training/admin/metriccat/:mcat",trnAdmEvts.deleteMetricCat)};