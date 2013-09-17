/*
    Metric schema
      Profile of the Metric
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var MetricSchema = module.exports = new Schema({
    //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true}
  , teams: [{
      name: {type: String, required: true}
    , gender: {type: String, required: true}
    }]

    //LO
  , athletes: [{
      name: {type: String, required: true}
    }]
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
  , name: {type: String, required: true, index: {unique: true}
    }
  , code: {type: String, required: true, index: {unique: true}}
  , meta: {
      mtype: [{type: String, required: true}]
    , units: [{type: String, required: true}]
    , ttmetric: Boolean
    , instructions: [String]
    , video: [String]
    }
},
  {
    collection: 'metrics',
    safe: true
  }
);

// virtuals
MetricSchema.virtual('MID').get(function() {
  return this._id;
});

// compound indexes
// MetricsSchema.index({teams: 1});
