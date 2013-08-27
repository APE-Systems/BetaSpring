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
  bioBW: [{
    val: String,
    dt: Date
  }],
  bioBFsf: [{
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
BioMetricsSchema.index({SID: 1, MID: 1, AID: 1});
