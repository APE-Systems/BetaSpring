/*
    Accounts schema
      Only Stores the usernames/passwords/school
*/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt-nodejs')
  , SALT_WORK_FACTOR = 10;

var AccountSchema = module.exports = new mongoose.Schema({
  username: {
    type: String
  , require: true
  , index: {unique: true}
  },
  password: {
    type: String
  , require: true
  }
}, {
  collection: 'accounts',
  safe: true
});

//hash password before saved
AccountSchema.pre('save', function(next) {
  var acct = this;
  //only hash the password if it has been modified (or is new)
  if (!acct.isModified('password')) return next();

  //generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    //hash the password along with our new salt
    bcrypt.hash(acct.password, salt, function(err, hash) {
      if (err) return next(err);

      //override the cleartext password with the hashed one
      acct.password = hash;
      next();
    });
  });
});

//password verification
AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}

// AccountSchema.methods.validPassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// }