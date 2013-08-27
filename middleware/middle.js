var Session = require('../models').Sessions
  , Coach = require('../models').Coaches
  , Athlete = require('../models').Athletes
  , secure = require('../security').secureMe
  , user, school;

// authenticate
module.exports.authenticate = function(req, res, next) {
  console.info('--------------');
  console.info('authentication');
  console.info('--------------');

  // identify user and check password
  findUser(res, req.body.username, passwordCheck);

  function passwordCheck (user) {
    var salt = user.password.split(',')[1];
    var password = req.body.password;

    secure.authenticate(user.password, password, salt, function(err, valid) {
      if (valid) {
        console.log("  authentication: success");
        console.log("  authentication name:", user.fullname + "\n");
        // set school to global
        school = user.school.replace(/\s/g, '');
        return next();
      } else {
        console.log("  authentication: fail");
        console.log("    password: fail\n");
        return res.render('login', {
          username: user.username
        });
      }
    });
  }
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
      req.session = sess;
      findUser(res, sess.username, function(user) {
        console.log('  User Session:', user.fullname);
        req.user = {
          username: user.username,
          fullname: user.fullname.split(' ')[0] || 'coach',
          teams: user.teams,
          school: user.school.replace(/\s/g, '')
        };
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
  school = req.user.school.replace(/\s/g, '');
  console.log('/'+school+'/dashboard');
  return res.redirect('/'+school+'/dashboard');
};

// set session
module.exports.setSession = function(req, res) {
  console.info('--------------');
  console.info('User Authenticated -> setSession');
  console.info('--------------');

  // check if a session already exists
  setSession(user, userDashboard);

  function userDashboard() {
    console.log('going to userDashboard');
    req.fullname = user.fullname;
    req.school = user.school.replace(/\s/g, '');
    req.teams = user.teams;
    console.info('\nlogin dateTime: ' + new Date());
    console.info('redirect:   /'+school+'/dashboard');
    return res.redirect('/'+school+'/dashboard');
    }

  function setSession(user, callback) {
    // check if session already exists
    evalSession(user.username, function(session) {
      if (session) {
        console.info('  session exists');
        removeSession(session, createSession);
      } else {
        console.info('  session nonexistant');
        console.info('  creating new session');
        createSession(user);
      }
    });

    function evalSession(username, callback) {
      console.info('evalute session');
      Session.findOne({username: username}, function(err, session) {
        if (err) {
          console.error('\n----ERROR----');
          console.error('session query(username):\n' + err);
          console.error('-------------');
          return res.redirect('/internal_error/user.setSession/' + err.code +'/');
        }
        return callback(session);
      });
    }

    function createSession(user) {
      // create session
      var newSession = new Session({
        username: user.username
      });
      // takes the newSession and ouputs hashed cookie to be saved
      secure.makeSecureVal(newSession, saveSession);
    }

    function saveSession(newSession, cookie) {
      newSession.cookie = cookie;
      newSession.save(function(err) {
        if (err) {
          console.error('\n----ERROR----');
          console.error('session save(session):\n' + err);
          console.error('-------------');
          return res.redirect('/internal_error/user.saveSession/' + err.code +'/');
        }
        console.info('  session saved');
        console.info('  set session cookie');
        res.cookie('.APEAUTH', newSession.cookie, {signed: true, path: '/', httpOnly: true});
        return userDashboard();
      });
    }

    function removeSession(session, callback) {
      console.info('  removing session');
      Session.findOneAndRemove({username: session.username}, function(err, sess) {
        if (err) {
          console.error('\n----ERROR----');
          console.error('session findOneAndRemove(username):\n' + err);
          console.error('-------------');
          return res.redirect('/internal_error/user.setSession/' + err.code +'/');
        }
        console.log('  session removed');
        return callback(session);
      });
    }

  }
};

// validate
module.exports.validate = function(req, res, next) {
  console.info('\n--------------');
  console.info('validate login');
  console.info('--------------');

  // validation check
  req.assert('req.body.username', 'Username is required').notNull();
  req.assert('req.body.username', 'Username must be an email').isEmail();
  req.assert('req.body.password', 'Password is required').notNull();
  req.assert('req.body.password', 'Password must be at least 8 characters').len(8);

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
      username: req.body.username || ''
    });
  }
  else {
    console.info('  validate login: success');
    console.info('  dateTime: ' + new Date() + '\n');
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
function findUser(res, username, callback) {
  console.info('+  identify user');  
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
      user = coach;
      return callback(coach);
    }
  });
}
