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
  proAgL: [{
    val: String,
    dt: Date
  }],
  proAgR: [{
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
