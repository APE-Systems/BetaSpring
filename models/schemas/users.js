/*
    Users schema
      Only Stores the usernames/passwords/school
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var UserSchema = module.exports = new mongoose.Schema({
  username: {
    type: String
  , require: true
  , index: {unique: true}
  },
  password: {
    type: String
  , require: true
  , index: true
  }
}, {
  collection: 'users',
  safe: true
});

// virtuals
UserSchema.virtual('UID').get(function() {
  return this._id;
});

// indexes
// UserSchema.index({username: 1, cookie: 1, date: 1});
