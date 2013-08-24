/*
    Session schema
*/
var mongoose = require('mongoose')
  , crypto = require('crypto');

var SessionSchema = module.exports = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  cookie: {
    type: String,
    require: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  collection: 'sessions',
  safe: true
});

// indexes
SessionSchema.index({username: 1, cookie: 1, date: 1});
