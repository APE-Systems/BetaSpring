/*
    Metric schema / index
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var MetricsSchema = module.exports = new Schema({
  SID: {
      type: Schema.Types.ObjectId
    // , required: true
  },
  AID: {
    type: Schema.Types.ObjectId,
    required: true,
    index: {unique: true}
  },
  Bio: {
    type: Schema.Types.ObjectId
    // , required: true
  },
  Speed: {
    type: Schema.Types.ObjectId
    // , required: true
  },
  Power: {
    type: Schema.Types.ObjectId
    // , required: true
  },
  Strength: {
    type: Schema.Types.ObjectId
    // , required: true
  }
},
  {
    collection: 'metrics',
    safe: true
  }
);

// methods

// indexes
MetricsSchema.index({SID: 1, AID: 1, bioM: 1, speed: 1, power: 1, strgth: 1});
