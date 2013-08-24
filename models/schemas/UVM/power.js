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
  pwVJ: [{
    val: String,
    dt: Date
  }],
  brdJ: [{
    val: String,
    dt: Date
  }],
  pwFJht: [{
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
PowerSchema.index({SID: 1, MID: 1, AID: 1});
