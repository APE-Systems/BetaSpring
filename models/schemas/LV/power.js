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
    // watts: String -- (61.9*(vj*2.54))+(36*(bw/2.2))+1822
    // centimeters v*2.54
  }],
  pwLJ: [{
    val: String,
    dt: Date
    // watts: String -- (61.9*(lj*2.54))+(36*(bw/2.2))+1822
    // centimeters v*2.54
  }],
  pwFJht: [{
    val: String,
    dt: Date
  }],
  pwFJgct: [{
    val: String,
    dt: Date
  }],
    // eratio: {type: String, get: } -- vj.v / fjump.ht
  SquJump40: [{
    val: String,
    dt: Date
  }],
  SquJump20: [{
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
