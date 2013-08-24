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
  thtyds: [{
    val: String,
    dt: Date
  }],
  proAgLa: [{
    val: String,
    dt: Date
  }],
  proAgRa: [{
    val: String,
    dt: Date
  }],
  thrhdyds: [{
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
SpeedSchema.index({SID: 1, MID: 1, AID: 1});
