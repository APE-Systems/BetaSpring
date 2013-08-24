/*
    Coach schema
*/
var mongoose = require('mongoose')
  , crypto = require('crypto');

var CoachSchema = module.exports = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      index: {unique: true}
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    fullname: {
      type: String,
      required: true
    },
    teams: {
      type: [String]
    },
    school: {
      type: String,
      required: true
    },
    aStDt: {
      type: Date,
      default: Date.now
    }
},
  {
    collection: 'coaches',
    safe: true
  }
);

// indexes
CoachSchema.index({username: 1, teams: 1, school: 1, fullname: 1});
