/*
    Group schema
      Profile of the Group
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var GroupSchema = module.exports = new Schema({
    //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true}
  , team: {
      name: {type: String, required: true}
    , gender: {type: String, required: true}
    }

    //LO
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

    //properties
  , name: {type: String, required: true}
  , notes: [String]
  , removed: {type: Boolean, default: false}
},
  {
    collection: 'groups',
    safe: true
  }
);

// virtuals
GroupSchema.virtual('GRPID').get(function() {
  return this._id;
});

// compound indexes
GroupSchema.index({team:1, name:1}, {unique: true});