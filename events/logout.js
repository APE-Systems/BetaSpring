function LogoutHandler() {
  "use strict";

  this.logoutAttempt = function(req, res, next) {
    console.log('logout attempt');
  }

}

module.exports = LogoutHandler;