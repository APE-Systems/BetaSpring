/*
    Metric Category schema
      Categories created by coaches that identify metrics that make-up the category
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var MetricCategorySchema = module.exports = new Schema({
  //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true}
  , team: {
      name: {type: String}
    , gender: {type: String}
    }

    //LO
  , trplans: [{
      name: {type: String, required: true}
    }]
  , surveys: [{
      name: {type: String, required: true}
    }]

    //properties
  , name: {type: String, required: true}
  , metrics: [{
      name: {type: String, required: true}
    }]
  , groups: [{
      name: {type: String, required: true}
    }]
  , athletes: [{
      name: {type: String, required: true}
    }]
  , removed: {type: Boolean, default: false}
},
  {
    collection: 'metriccats'
  , safe: true
  }
);

// virtuals
MetricCategorySchema.virtual('MCATID').get(function() {
  return this._id;
});

// compound indexes
MetricCategorySchema.index({team: 1, name: 1}, {unique: true});