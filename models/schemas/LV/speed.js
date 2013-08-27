/*
  Speed Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SpeedSchema = module.exports = new Schema({
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
  tenyds: [{
    val: String,
    dt: Date
  }],
  twnyds: [{
    val: String,
    dt: Date
  }],
  fvmbk: [{
    val: String,
    dt: Date
  }],
  hm1h: [{
    val: String,
    dt: Date
  }],
  hm1e: [{
    val: String,
    dt: Date
  }],
  hm2: [{
    val: String,
    dt: Date
  }],
  hh: [{
    val: String,
    dt: Date
  }],
  hmr1: [{
    val: String,
    dt: Date
  }],
  hmr2: [{
    val: String,
    dt: Date
  }],
  hmavg: [{
    val: String,
    dt: Date
  }]
},
  {
    collection: 'speedmetrics',
    safe: true
  }
);


// methods

// indexes
SpeedSchema.index({MID: 1});
