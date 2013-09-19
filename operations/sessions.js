;"use strict";

var mongoose = require('mongoose')
  , Sessions, ape;

//TODO:
//  use REDIS for session handling
ape = mongoose.createConnection("mongodb://localhost:27017/ape?safe=true");
Sessions = ape.model('sessions', require('../models/schemas/sessions'));

module.exports = exports = {

  getSession: function(session_id, callback) {
    console.log('SessionOPS: getUsername');
    if (!session_id) {
      console.log('no session id');
      callback(Error("Session not set"), null);
      return;
    }
    Sessions.findOne({ '_id': session_id }, {username:1, school:1}, function(err, session) {
      if (err) return callback(err, null);

      if (!session) {
        console.log('session is not in the database');
        callback(new Error("Session: " + session + " does not exist"), null);
        return;
      }

      callback(null, session);
    });
  }

}
