/*
    Athlete schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var AthleteSchema = module.exports = new Schema({
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
      type: String
    },
    teams: {
      type: [String],
      required: true
    },
    school: {
      type: String,
      required: true
    },
    metrics: {
      type: Schema.Types.ObjectId,
      unique: true
    },
    year: {
      type: String
    },
    group: {
      type: String
    },
    position: {
      type: String
    },
    aStDt: {
      type: Date,
      default: Date.now
    }
},
  {
    collection: 'athletes',
    safe: true
  }
);

// indexes
AthleteSchema.index({fullname: 1, metrics: 1, year: 1, group: 1, position: 1, school: 1, teams: 1});
