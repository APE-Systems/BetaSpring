/*
    Coaches schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var CoachSchema = module.exports = new mongoose.Schema({
    //origin
    createdBy: {type: String, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true}
  , // TODO: write check so that only unique pair exists (name, gender) within document
    teams: [{
      name: {type: String, required: true}
    , gender: {type: String, required: true}
    }]

    //LO
  , trplans: [{
      name: {type: String, required: true}
    }]
  , surveys: [{
      name: {type: String, required: true}
    }]
  , athletes: [{
      name: {type: String, required: true}
    }]
  , groups: [{
    name: {type: String, required: true}
  }]

    //properties
  , username: {type: String, required: true, index: {unique: true}}
  , name: {type: String, required: true, index: true}
  , admin: {type: String, required: true}
  , removed: {type: Boolean, default: false}
  }
, {
    collection: 'coaches'
  , safe: true
  }
);

// virtuals
CoachSchema.virtual('COID').get(function() {
  return this._id;
});

// compound indexes
// NOTE:
//  cannot enfore 'uniqueness' within the document itself
//  only between documents
// CoachSchema.index({username: 1, 'teams.name': 1, 'teams.gender': 1}, {unique: true});
