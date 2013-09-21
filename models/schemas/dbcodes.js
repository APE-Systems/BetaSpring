/*
    Database Code Connection schema
      used to store unique school code for reference to school's database
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = mongoose.Types
  , ObjIdType = Schema.ObjectId
  , ObjId = Types.ObjectId;

var DBCodeSchema = module.exports = new Schema({
    //properties
    school: {type: String, required: true}
  , dbcode: {type: String, required: true}
}, {
    collection: 'dbcodes'
  , safe: true
  }
  // , {
  //   autoIndex: false
  // }
);

// virtuals
DBCodeSchema.virtual('DBCOID').get(function() {
  return this._id;
});

// compound indexes
DBCodeSchema.index({name:1, dbcode:1}, {unique:true});