/*
    Session schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var SessionSchema = module.exports = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now
  },
  school: {
    type: String
  , require: true
  , index: true
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
