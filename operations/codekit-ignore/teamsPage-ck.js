"use strict";function validateInput(e,t){function s(i,s,o){if(n<e[i].length){console.info("Validation: Error\n");t(cliErrors("maxCharacters"),null);return!0}if(!r.test(e[i])){console.info("Validation: Error\n");t(cliErrors("invalidInput"),null);return!0}}console.log("Operations: validateInput\n");var n=45,r=/^[_]*[A-Z0-9][A-Z0-9 _.-]*$/i,i=Object.keys(e);if(!i.some(s)){console.info("Validation: Success");return t(null,e)}}function propagateUpdate(e,t){function i(){var n={name:e.sess.school,"teams.name":e.oldTeam.name,"teams.gender":e.oldTeam.gender},r={$set:{"teams.$.name":e.newTeam.name,"teams.$.gender":e.newTeam.gender}};APE.Schools.update(n,r,function(e,n,r){if(e)return t(dbErrors(e));console.info("Updated: School",n,r);s();return})}function s(){var r={$set:{"teams.$.name":e.newTeam.name,"teams.$.gender":e.newTeam.gender}};e.Mods.Coaches.update(n,r,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Updated: Coaches",n,r);o();return})}function o(){var r={$set:{"teams.$.name":e.newTeam.name,"teams.$.gender":e.newTeam.gender}};e.Mods.Metrics.update(n,r,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Updated: Metrics",n,r);u();return})}function u(){var n={$set:{team:{name:e.newTeam.name,gender:e.newTeam.gender}}};e.Mods.MetricCats.update(r,n,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Updated: Metric Categories",n,r);a();return})}function a(){var n={$set:{team:{name:e.newTeam.name,gender:e.newTeam.gender}}};e.Mods.Athletes.update(r,n,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Updated: Athletes",n,r);f();return})}function f(){var n={$set:{team:{name:e.newTeam.name,gender:e.newTeam.gender}}};e.Mods.Groups.update(r,n,{multi:!0},function(n,r,i){if(n)return t(dbErrors(n));console.info("Updated: Groups",r,i);t(null,e.newTeam);return})}console.log("propagating update");var n={school:e.sess.school,"teams.name":e.oldTeam.name,"teams.gender":e.oldTeam.gender},r={school:e.sess.school,"team.name":e.oldTeam.name,"team.gender":e.oldTeam.gender};i()}function propagateDelete(e,t){function o(){var n={name:e.sess.school,"teams.name":e.team.name,"teams.gender":e.team.gender};APE.Schools.update(n,i,function(e,n,r){if(e)return t(dbErrors(e));console.info("Deleted: School\n",n,r);u();return})}function u(r){e.Mods.Coaches.update(n,i,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Deleted: Coaches",n,r);a();return})}function a(){e.Mods.Metrics.update(n,i,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Deleted: Metrics",n,r);f();return})}function f(){e.Mods.MetricCats.update(r,s,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Deleted: Metric Categories",n,r);l();return})}function l(){e.Mods.Athletes.update(r,s,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Deleted: Athletes",n,r);c();return})}function c(){e.Mods.Groups.update(r,s,{multi:!0},function(e,n,r){if(e)return t(dbErrors(e));console.info("Deleted: Groups",n,r);t(null);return})}console.log("propagating delete");var n={school:e.sess.school,"teams.name":e.team.name,"teams.gender":e.team.gender},r={school:e.sess.school,"team.name":e.team.name,"team.gender":e.team.gender},i={$pull:{teams:{name:e.team.name,gender:e.team.gender}}},s={$set:{"team.name":"","team.gender":""}};o()}var APE=require("../models/db/config").apeMods,dbErrors=require("../operations/errors.js").dbErrors,cliErrors=require("../operations/errors.js").cliErrors,teamsPageOps={getTeamsPage:function(e,t){function i(e){var n={school:e.sess.school,"coaches.username":e.sess.username},i={name:1,gender:1,mtrcats:1,metrics:1};e.Mods.Teams.find(n,i,function(n,i){n&&t(dbErrors(n),null);r.teams=i;return s(e)})}function s(e){var n={},i={},s={name:1,metrics:1};APE.MetricCats.find(i,s,function(e,i){e&&t(dbErrors(e),null);n.mtrcats=i;APE.Metrics.find({"mtrcats.name":{$exists:!1}},{name:1},function(e,i){e&&t(dbErrors(e),null);n.metrics=i;r.apeLibPackage=n;t(null,r);return})})}console.log("Operation: getTeamsPage");var n={sess:e.sess,Mods:e.models},r={};return i(n)},createTeam:function(e,t){function r(r,i){function u(e,n){console.log("saving team");e.save(function(r){return r?t(dbErrors(r),null):n(e,f)})}function a(e,n){var r={name:e.school},i={$push:{teams:{_id:e._id,name:e.name,gender:e.gender}}};APE.Schools.update(r,i,function(r,i){if(r)return t(dbErrors(r),null);console.log("team saved in school:",i);return n(e)})}function f(e){var n={school:e.school},r={$push:{teams:{_id:e._id,name:e.name,gender:e.gender}}};s.Mods.Coaches.update(n,r,{multi:!0},function(n,r){if(n)return t(dbErrors(n),null);console.info("team saved in coaches:",r);return t(null,e)})}if(r)return t(r,null);var s={team:n,sess:e.sess,Mods:e.models},o=new s.Mods.Teams;o.createdBy=s.sess.COID;o.coaches.push({_id:s.sess.COID,username:s.sess.username,name:s.sess.name});o.school=s.sess.school;o.name=s.team.name;o.gender=s.team.gender;u(o,a)}console.log("Operation: createTeam");var n={name:e.params.team,gender:e.params.gender};validateInput(n,r)},updateTeam:function(e,t){function r(r,i){if(r)return t(r,null);var s={sess:e.sess,Mods:e.models,oldTeam:{name:n.oldName,gender:n.oldGen}},o={name:i.oldName,gender:i.oldGen},u={$set:{name:i.newName,gender:i.newGen}};s.Mods.Teams.findOneAndUpdate(o,u,{"new":!0},function(e,n){if(e)return t(dbErrors(e),null);if(!n)return t(cliErrors("notFound",null));console.log("teamUpdated:\n",n.name,n.gender);s.newTeam=n;propagateUpdate(s,t);return})}console.log("Operation: updateTeam");var n={oldName:e.params.team,oldGen:e.params.gender,newName:e.body["edit-team-name"],newGen:e.body["edit-team-gender"]};validateInput(n,r)},deleteTeam:function(e,t){function r(n,r){if(n)return t(n,null);var i={sess:e.sess,Mods:e.models},s={name:r.name,gender:r.gender,"coaches.username":i.sess.username};i.Mods.Teams.findOneAndRemove(s,function(e,n){if(e)return t(dbError(e),null);if(!n)return t(cliErrors("notFound"));console.log("teamDelete:\n",n.name,n.gender);i.team=n;propagateDelete(i,t);return})}console.log("Operation: deleteTeam");var n={name:e.params.team,gender:e.params.gender};validateInput(n,r)}};module.exports=exports=teamsPageOps;