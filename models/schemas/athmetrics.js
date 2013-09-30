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
      name: {type: String, required: true}
    , gender: {type: String, required: true}
    }

    //LO
  , athlete: {
      _id: {type: ObjIdType, required: true}
    , name: {type: String, required: true, index: true}
    }
  , mtrcats: [{
      name: {type: String, required: true}
    }]
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
  , name: {type: String, required: true, index: true}
  , code: {type: String, required: true}
  , meta: {
      mtype: [{type: String, required: true}]
    , units: [{type: String, required: true}]
    , ttmetric: Boolean
    , instructions: [String]
    , video: [String]
    }
  , data: [{
      val: {type: String, required: true}
    , dt: {type: Date, required: true}
    , units: {type: String, required: true}
    , note: String
    , grp: {type: String, default: 'all'}
    }]
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
AthMetricSchema.index({'data.dt': 1});
AthMetricSchema.index({"athlete._id": 1, name: 1}, {unique: true});
AthMetricSchema.index({"team.name": 1, 'team.gender': 1});
AthMetricSchema.index({"team.name": 1, 'team.gender': -1, name: 1, 'athlete.name': 1});
