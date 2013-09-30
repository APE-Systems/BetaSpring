/*
  FMS Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var FMSSchema = module.exports = new Schema({
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
  dsq: [{
    val: String,
    dt: Date
  }],
  hstp: [{
    val: String,
    dt: Date
  }],
  illg: [{
    val: String,
    dt: Date
  }],
  shmob: [{
    val: String,
    dt: Date
  }],
  aslr: [{
    val: String,
    dt: Date
  }],
  stbpu: [{
    val: String,
    dt: Date
  }],
  rtstb: [{
    val: String,
    dt: Date
  }]
},
  {
    collections: 'fmsmetrics',
    safe: true
  }
);

// methods

// indexes
FMSSchema.index({SID: 1, MID: 1, AID: 1});
