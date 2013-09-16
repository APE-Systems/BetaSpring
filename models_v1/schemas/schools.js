/*
    School schema
*/
var mongoose = require('mongoose');

var SchoolSchema = module.exports = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    index: {unique: true}
  },
  teams: [String]
},
  {
    collection: 'schools',
    safe: true
  }
);

// indexes
SchoolSchema.index({domain: 1, teams: 1});
