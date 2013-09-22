/*
    Athlete schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var AthleteSchema = module.exports = new Schema({
    //origin
    createdBy: {type: ObjIdType, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , school: {type: String, required: true}
  , team: {
      name: {type: String, required: true}
    , gender: {type: String, required: true}
    }
  , coaches: [{
      username: {type: String, required: true}
    , name: {type: String, required: true}
    }]

    //LO
  , trplans: [{
      name: {type: String, required: true}
    }]
  , surveys: [{
      name: {type: String, required: true}
    }]

    //properties
  , username: {type: String, required: true, index: {unique: true}}
  , name: {type: String, required: true, index: true}
  , positions: [String]
    //year: [{year: , date: }]
  , years: [String]
  , hometown: String
  , mtrcats: [{
      name: {type: String, required: true}
    , metrics: [{name: {type: String, required: true}}]
    }]
  , metrics: [{
      name: {type: String, required: true}
  }]
  , groups: [{
      name: {type: String, required: true}
    }]
  }
, {
    collection: 'athletes'
  , safe: true
  }
);

// virtuals
AthleteSchema.virtual('ATHID').get(function() {
  return this._id;
});

// compound indexes
// AthleteSchema.index({"mtrcats.name": 1, "mtrcats.metrics.name": 1}, {unique: true});
// note: the above index does not allow the same mtrcats.name and mtrcats.metrics.name in any two documents... which doesn't make sense.