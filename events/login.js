;"use strict";


module.exports = exports = {

  displayLogin: function(req, res, next) {
    console.log('event: display login');
    res.render('login');
  }

}