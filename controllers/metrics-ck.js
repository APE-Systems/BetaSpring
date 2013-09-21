function alphaSort(e,t){return e<t?-1:e>t?1:0}function getModelMetricsLabels(e,t,n){var r=["_id","__v","SID","MID","AID","teams"],i=[];for(var s in e[t].schema.paths)r.indexOf(s.toString())===-1&&i.push(s);return n(i)}function dtSort(e,t){return e.dt<t.dt?1:e.dt>t.dt?-1:0}var athlete=require("../models").Athletes,labels={bioHT:"Body Height (in)",bioBW:"Body Weight (lbs)",bioBF:"Body Fat (%)",bioBFsf:"Body Fat-SF (%)",reach:"Reach (in)",appToHt:"Approach Touch Height (in)",appVJ:"Approach Vertical Jump (in)",stVJ:"Standing Vertical Jump (in)",stVJToHt:"Standing Vertical Jump Touch (in)",pwVJ:"Vertical Jump (in)",pwLJ:"Long Jump (in)",pwFJht:"Four Jump (ht)",pwFJgct:"Four Jump (gct)",brdJ:"Broad Jump",SquJump40:"40% Squat Jump (pp)",SquJump20:"20k Squat Jump (watts)",medBall:"Medicine Ball (ft)",tenyds:"10 YDS (sec)",twnyds:"20 YDS (sec)",thtyds:"30 YD Sprint (avg)",frtyds:"40 YD Sprint (sec)",thrhdyds:"300 YD Shuttle (sec)",fvmbk:"Five Mile Bike (time)",hm1h:"Home-1st (sec-hand)",hm1e:"Home-1st (sec-elec)",hm2:"Home-2nd (sec)",hh:"H-H (sec-hand)",hmr1:"1/2 Mile (rep 1)",hmr2:"1/2 Mile (rep 2)",hmavg:"1/2 Miles (avg)",proAgL:"Pro Agility L (sec)",proAgR:"Pro Agility R (sec)",proAgLa:"Pro Agility L (avg)",proAgRa:"Pro Agility R (avg)",pcl:"Power Clean (lbs)",hgcl:"Hang Clean (lbs)",hgclsh:"Hang Clean Shrug (lbs)",squ:"Squat (lbs)",bsq:"Back Squat (lbs)",fsq:"Front Squat (lbs)",dsq:"Deep Sq (reps)",bp:"Bench Press (lbs)",ir:"Inv. Row (rep)",pu:"Pull Ups (reps)",chup:"Chin Ups (reps)",hstp:"Hurdle Step (reps)",illg:"IL Lunge (reps)",shmob:"SH Mob",aslr:"ASLR (reps)",stbpu:"Stability PU (reps)",rtstb:"Rot Stability (reps)",wgpk:"Wingate Peak (watts)",wgrel:"Wingate Relative (watts/lbs)"};module.exports.index=function(e,t){console.info("\n\r---------------------");console.info("AJAX: Category/Model Index");console.info("/categories/"+e.params.category+"/metrics");console.info("---------------------");var n=e.models,r=e.params.category,i={};getModelMetricsLabels(n,r,function(e){metricLables=e.sort(alphaSort);for(var n in metricLables)i[metricLables[n]]=labels[metricLables[n]];console.log("objLabels",i);t.json(200,{metricLabels:i})})};module.exports.create=function(e,t){console.info("\n\r---------------------");console.info("AJAX: /athletes/"+e.params.id+"/metrics");console.info("Category:",e.body.category);console.info("Metric",e.body.metric);console.info("Input Value",e.body.value);console.info("---------------------");var n=e.models,r=e.params.id,i=e.body.category,s=e.body.metric,o=e.body.value,u={};u[s]={val:o,dt:new Date};n[i].findOneAndUpdate({AID:r},{$push:u},{select:s},function(e,n){if(e)throw e;console.log("most recent",n[s].sort(dtSort)[0]);var r=n[s].sort(dtSort)[0];t.json(200,{update:r})})};module.exports.destroy=function(e,t){console.info("\n\r---------------------");console.info("AJAX: /athletes/"+e.params.id+"/metrics");console.info("Category:",e.body.category);console.info("Metric",e.body.metric);console.info("dataId",e.body.dataId);console.info("---------------------");var n=e.models,r=e.params.id,i=e.body.category,s=e.body.metric,o=e.body.dataId,u={};u[s]={_id:o};n[i].findOneAndUpdate({AID:r},{$pull:u},{select:s},function(e,n){if(e)throw e;console.log("data removed:",o);t.json(200)})};