/*
    Team schema
      Information about a specific team within a school
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var TeamSchema = module.exports = new Schema({
    //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true, index: true}

    //LO
  , coaches: [{
      username: {type: String, required: true}
    , name: {type: String, required: true}
    }]

    //properties
  , name: {type: String, required: true, index: true}
  , gender: {type: String, required: true, index: true}
  , groups: [{
      name: {type: String, required: true}
      // the creation of a group automatically creates the group schema with preDefined attribues
    }]
  , trplans: [{
      name: {type: String, required: true}
    }]
  , surveys: [{
      name: {type: String, required: true}
    }]
  , mtrcats: [{
      name: {type: String, required: true}
    , metrics: [{name: {type: String, required: true}}]
    }]
  , metrics: [{
      name: {type: String, required: true}
    }]
  , athletes: [{
      name: {type: String, required: true}
    }]
  , removed: {type: Boolean, default: false} 
  }
, {
    collection: 'teams'
  , safe: true
  }
);

// virtuals
TeamSchema.virtual('TMID').get(function() {
  return this._id;
});

// compound indexes
TeamSchema.index({name: 1, gender: -1}, {unique: true});
