/*
  Power Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var PowerSchema = module.exports = new Schema({
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
  appToHt: [{
    val: String,
    dt: Date
  }],
  appVJ: [{
    val: String,
    dt: Date
  }],
  stVJ: [{
    val: String,
    dt: Date
  }],
  stVJToHt: [{
    val: String,
    dt: Date
  }]
},
  {
    collection: 'powermetrics',
    safe: true
  }
);

// methods

// indexes
PowerSchema.index({MID: 1});
