var Session = require('../models').Sessions
  , Coach = require('../models').Coaches
  , Athlete = require('../models').Athletes
  , secure = require('../security').secureMe;

// authenticate
module.exports.authenticate = function(req, res, next) {
  console.info('--------------');
  console.info('authentication');
  console.info('--------------');

  var username = req.body.username
    , password = req.body.password
    , salt;

  findUser(req, res, username, function(user) {
    // grab salt and authenticate
    salt = user.password.split(',')[1];

    // authenticate username + password
    if (!secure.authenticate(user.password, password, salt)) {
      console.log("  authentication: fail\n");
      console.log("    password: fail\n");
      return res.render('login', {
        username: username
      });
    }
    else {
      console.log("  authentication: success");
      console.log("  authentication name:", user.fullname + "\n");
      return next();
    }
  });
}; // end authenticate

// check cookie
module.exports.checkCookie = function(req, res, next) {
  // check if signedCookie is set
  console.info('\n\r---------------------');
  console.info('validate signedCookie');
  console.info('---------------------');

  if (req.signedCookies['.APEAUTH']) {
    console.info('  signedCookie validation: success');
    return next();
  }
  else {
    console.info('  signedCookie validation: fail');
    console.info('  redirect to /login\n');
    res.render('login', {
      username: req.body.username || ''
    });
  }
}; // end check cookie

// check session
module.exports.checkSession = function(req, res, next) {
  console.info('\n\r---------------------');
  console.info('check session');
  console.info('---------------------');

  // check that cookie matches the session
  signedIn = req.signedCookies['.APEAUTH'];
  Session.findOne({cookie: signedIn}, function(err, sess) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('session query(cookie):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/mid.checkSession/' + err.code +'/');
    }

    if (sess) {
      console.info('  session: success');
      req.session._id = sess._id;
      findUser(req, res, sess.username, function(user) {
        console.log('User Session:', user.fullname);
        req.username = sess.username;
        req.fullname =  user.fullname.split(' ')[0] || 'coach';
        return next();
    });
      
    }
    else {
      console.info('  session: fail');
      console.info('  redirect: /login');
      res.clearCookie('.APEAUTH');
      res.redirect('/login');
    }
  });
};

// redirect
module.exports.redirect = function(req, res) {
  var school = req.school;
  console.log('/'+school+'/dashboard');
  return res.redirect('/'+school+'/dashboard');
};

// set session
module.exports.setSession = function(req, res) {
  // ONLY if user is authenticated
  console.info('--------------');
  console.info('session');
  console.info('--------------');

  // create session
  var session = new Session({
        username: req.body.username,
        date: new Date()
      });
  // session cookie
  session.cookie = secure.makeSecureVal(session._id.toString());

  // check if a session exists
  Session.findOne({username: req.body.username}, function(err, sess) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('session query(username):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/user.setSession/' + err.code +'/');
    }

    // if session DOES NOT exist, create, save and render
    if (!sess) {
      console.info('  set session');
      console.info('  session_id:', session._id);

      // save session
      saveSession(res, session, function() {
        findUser(req, res, session.username, function(user) {
          var school = req.school;
          console.info('  redirect: dashboard\n');
          res.cookie('.APEAUTH', session.cookie, {signed: true, path: '/', httpOnly: true});
          console.log('/'+school+'/dashboard');
          return res.redirect('/'+school+'/dashboard');
        });
      });
    }

    // if session DOES exists, then clear and reset
    else {
      console.log('  session exists');
      Session.findOneAndRemove({username: sess.username}, function(err, sess) {
        if (err) {
          console.error('\n----ERROR----');
          console.error('session findOneAndRemove(username):\n' + err);
          console.error('-------------');
          return res.redirect('/internal_error/user.setSession/' + err.code +'/');
        }
        console.log('  session removed');
        saveSession(res, session, function() {
          findUser(req, res, session.username, function(user) {
            console.info('  redirect: dashboard\n');
            res.cookie('.APEAUTH', session.cookie, {signed: true, path: '/', httpOnly: true});
            return res.redirect('/'+req.school+'/dashboard');
          });
        });
      });
    }
  });
};

// validate
module.exports.validate = function(req, res, next) {
  console.info('\n--------------');
  console.info('validate login');
  console.info('--------------');
  var username = req.body.username || '';
  var password = req.body.password || '';

  // validation check
  req.assert('username', 'Username is required').notNull();
  req.assert('username', 'Username must be an email').isEmail();
  req.assert('password', 'Password is required').notNull();
  req.assert('password', 'Password must be at least 8 characters').len(8);

  var errors = req.validationErrors();
  if (errors) {
    errors.forEach(function(item, index, array) {
      console.error('login Errors:');
      console.error('param:', item.param);
      console.error('msg:', item.msg);
      console.error('input value:', item.value);
    });
    // render errors
    console.log('  validate login: fail\n');
    return res.render('login', {
      username: username || ''
    });
  }
  else {
    console.log('  validate login: success\n');
    return next();
  }
}; // end validate

/*
 * ---------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------
 * ---------------------------HELPER FUNCTIONS--------------------------------------
 * ---------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------
*/

/*
 * Find the type of user: Coach or Athlete
 */
function findUser(req, res, username, cb) {
  console.info('  + identify user');
  Coach.findOne({username: username}, function(err, coach) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('coach query(username):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/fun.findUser/' + err.code +'/');
    }

    // 'user' variable autocast to true in mongoose
    if (!coach) {
      console.info('    user not a registered coach');
      console.info('    redirecting to login'); //should be signUp
      return res.render('login', {
        username: username
      });
    }
    else {
      req.fullname = coach.fullname;
      req.school = coach.school.replace(/\s/g, '');
      req.teams = coach.teams;
      console.info('      coach:', req.fullname);
      console.info('      school:', req.school);
      console.info('      teams:', req.teams + '\n');
      cb(coach);
    }
  });
}

/*
 * Save the Session
 */
function saveSession(res, session, cb) {
  // console.log('saving session\n', session);
  session.save(function(err) {
    if (err) {
      console.error('\n----ERROR----');
      console.error('session save(session):\n' + err);
      console.error('-------------');
      return res.redirect('/internal_error/user.saveSession/' + err.code +'/');
    }
    console.info('  session saved');
    cb();
  });
}
