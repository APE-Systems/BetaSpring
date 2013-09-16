/*
  Strength Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var StrengthSchema = module.exports = new Schema({
  SID: {
    type: Schema.Types.ObjectId
    //, required: true
  },
  MID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  AID: {
    type: Schema.Types.ObjectId,
    required: true,
    index: {unique: true}
  },
  teams: {
    type: [String]
  },
  chup: [{
    val: String,
    dt: Date
  }],
  bp: [{
    val: String,
    dt: Date
  }],
  fsq: [{
    val: String,
    dt: Date
  }],
  wgpk: [{
    val: String,
    dt: Date
  }],
  wgrel: [{
    val: String,
    dt: Date
  }]
},
  {
    collections: 'strengthmetrics',
    safe: true
  }
);

// indexes
StrengthSchema.index({SID: 1, MID: 1, AID: 1});
