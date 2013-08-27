/*
    RecordTime schema / index
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var RecordTimeSchema = module.exports = new Schema({
  SID: {
    type: Schema.Types.ObjectId
    , required: true
    , index: {unique: true
    }
  },
  time: {
    type: [Date]
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
// RecordTimeSchema.index({SID: 1, time: 1});
