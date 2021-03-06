/*
    BioMetric schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BioMetricsSchema = module.exports = new Schema({
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
  bioHT: [{
    val: String,
    dt: Date
  }],
  bioBW: [{
    val: String,
    dt: Date
  }]
},
  {
    collection: 'biometrics',
    safe: true
  }
);

// methods

// indexes
BioMetricsSchema.index({MID: 1});
