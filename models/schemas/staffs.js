/*
    Staff schema
      Internal APE Staff Schema
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var StaffSchema = module.exports = new Schema(
  {
    createdBy: {type: String, required: true}
  , createdOn: {type: Date, required: true, default: Date.now}
  , name: {type: String, required: true, index: {unique: true}}
  },
  {
    collection: 'staffs'
  , safe: true
  }
);

// virtuals
StaffSchema.virtual('STAFFID').get(function() {
  return this._id;
});
