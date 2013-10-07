/*
    Session schema
<<<<<<< HEAD
*/var mongoose=require("mongoose"),Schema=mongoose.Schema,Types=mongoose.Types,ObjIdType=Schema.ObjectId,ObjId=Types.ObjectId,SessionSchema=module.exports=new mongoose.Schema({COID:{type:ObjIdType,required:!0,index:{unique:!0}},name:{type:String,require:!0,index:!0},username:{type:String,require:!0,index:{unique:!0}},cookie:{type:String,require:!0,index:{unique:!0}},school:{type:String,require:!0,index:!0},date:{type:Date,"default":Date.now}},{collection:"sessions",safe:!0});SessionSchema.virtual("SSID").get(function(){return this._id});
=======
*/var mongoose=require("mongoose"),Schema=mongoose.Schema,Types=mongoose.Types,ObjIdType=Schema.ObjectId,ObjId=Types.ObjectId,SessionSchema=module.exports=new mongoose.Schema({COID:{type:ObjIdType,required:!0,index:{unique:!0}},name:{type:String,require:!0,index:!0},username:{type:String,require:!0,index:{unique:!0}},cookie:{type:String,require:!0,index:{unique:!0}},school:{type:String,require:!0,index:!0},webdom:{type:String,require:!0,index:!0},date:{type:Date,"default":Date.now}},{collection:"sessions",safe:!0});SessionSchema.virtual("SSID").get(function(){return this._id});
>>>>>>> cc1bdc043bc2441cb153f81fe90b520fba255ddd
