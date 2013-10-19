/*
    Athlete Metric schema
      Exercises and biometrics that belong to individual athletes
      Data added by athlete goes in here
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var AthMetricSchema = module.exports = new Schema({
    //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true}
  , team: {
      name: {type: String, required: true,index:true}
    , gender: {type: String, required: true,index:true}
    }

    //LO
  , athlete: {
      _id: {type: ObjIdType, required: true,index:true}
    , name: {type: String, required: true}
    }
  , mtrcat: {
      _id: {type: ObjIdType, required: true,index:true}
    , name: {type: String, required: true}
    }
  , groups: [{
      name: {type: String, required: true}
    }]
  , trplans: [{
      name: {type: String, required: true}
    }]
  , surveys: [{
      name: {type: String, required: true}
    }]

    //properties
  , metric: {
      _id: {type: ObjIdType, required: true, index:true}
    , name: {type: String, required: true}
    }
  , data: {type: String, required: true, index:true}
  , dt: {type: Date, required: true}
  , units: {type: String, required: true}
  , note: String
  , grp: String
  },
  {
    collection: 'athmetrics',
    safe: true
  }
);

// virtuals
AthMetricSchema.virtual('ATHMID').get(function() {
  return this._id;
});

// compound indexes
AthMetricSchema.index({"team.name": 1, 'team.gender': -1, 'athlete._id':1, 'mtrcat._id':1, 'metric._id':1, dt:1}, {unique: true});
AthMetricSchema.index({"team.name": 1, 'team.gender': -1, 'athlete._id':1, 'mtrcat._id':1, 'metric._id':1});
AthMetricSchema.index({"team.name": 1, 'team.gender': -1, metric: 1});