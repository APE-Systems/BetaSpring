/*
    Session schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var SessionSchema = module.exports = new mongoose.Schema({
  COID: {type: ObjIdType, required: true, index: {unique: true}},
  name: {
    type: String
  , require: true
  , index: true
  },
  username: {
    type: String
  , require: true
  , index: {unique: true}
  },
  cookie: {
    type: String
  , require: true
  , index: {unique: true}
  },
  school: {
    type: String
  , require: true
  , index: true
  },
  webdom: {
    type: String
  , require: true
  , index: true

  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'sessions',
  safe: true
});

// virtuals
SessionSchema.virtual('SSID').get(function() {
  return this._id;
});

// indexes
// SessionSchema.index({username: 1, cookie: 1, date: 1});
