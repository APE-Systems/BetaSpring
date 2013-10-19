/*
    School schema
      GLOBAL picture of the school
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var SchoolSchema = module.exports = new Schema({
    //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , teams: [{
      name: {type: String, required: true}
    , gender: {type: String, required: true}
    }]

    //properties
  , name: {type: String, required: true, index: {unique: true}}
  , webdom: [{type: String, required: true}]
  , coaches: [{
      username: {type: String, required: true}
    , name: {type: String, required: true}
    }]
  , athletes: [{
      name: {type: String, required: true}
    }]
  , removed: {type: Boolean, default: false}}
, {
    collection: 'schools'
  , safe: true
  }
  // , {
  //   autoIndex: false
  // }
);

// virtuals
SchoolSchema.virtual('SCHID').get(function() {
  return this._id;
});

// compound indexes
// NOTE:
//  cannot enfore 'uniqueness' within the document itself
//  only between documents
//SchoolSchema.index({name: 1, 'teams.name': 1, 'teams.gender': 1}, {unique: true});
// SchoolSchema.index({name: 1, 'coaches.username': 1}, {unique: true});
