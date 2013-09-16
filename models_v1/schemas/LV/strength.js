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
  pcl: [{
    val: String,
    dt: Date
  }],
  bsq: [{
    val: String,
    dt: Date
  }],
  fsq: [{
    val: String,
    dt: Date
  }],
  bp: [{
    val: String,
    dt: Date
  }],
  ir: [{
    val: String,
    dt: Date
  }],
  pu: [{
    val: String,
    dt: Date
  }]
},
  {
    collections: 'strengthmetrics',
    safe: true
  }
);

// methods

// indexes
StrengthSchema.index({MID: 1});
