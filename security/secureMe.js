/*
 * Crypto Functions for secure logins
 */
var crypto = require('crypto');

function makeSalt() {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  salt = '';
  for(var i=0; i < 5; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    salt = salt + chars[rnum];
  }
  return salt;
}

function hashStr(s) {
  var key = 'thisisnotasecret';
  var base = crypto.createHmac('sha512', key).digest('base64');
  return base;
}

// note that `.update(password)` changes the value of password making login validation tricky
function makePwHash(password, salt) {
  salt = salt || makeSalt();
  return crypto.createHmac('sha512', password).digest('base64') + ',' + salt;
}

var makeSecureVal = module.exports.makeSecureVal = function(s) {
  return s + '|' + hashStr(s);
};

var checkSecureVal = module.exports.checkSecureVal = function(h) {
    // console.log('check secure cookie value: ' + h);
    console.log('checking secure cookie value');
    if (h.split('.')[0])
      h = h.split('.')[0];
    var val = h.split('|')[0];
    if (h === makeSecureVal(val))
      return val;
    else return false;
  };

var authenticate = module.exports.authenticate = function(passwordSalt, password, salt) {
  console.log('passwordSalt', passwordSalt);
  console.log('password', password);
  console.log('salt', salt);
  console.log('makePwHash', makePwHash(password, salt));
  return makePwHash(password, salt) === passwordSalt;
};
