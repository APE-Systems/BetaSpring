/*
    RecordTime schema / index
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var RecordTimeSchema = module.exports = new Schema({
  SID: {
    type: Schema.Types.ObjectId
    //, required: true
  },
  time: {
    type: [Date]
  , required: true
  , index: {unique: true}
  }
},
  {
    collection: 'recordTimes',
    safe: true
  }
);

// methods

// indexes
RecordTimeSchema.index({SID: 1, time: 1});
