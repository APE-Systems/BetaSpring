var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator');

var app = express();

app.configure(function() {
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view options', { layout: false });
  app.use(express.favicon(__dirname + '/public/_imgs/ape.ico'));
  app.use(express.logger('dev'));
  app.use(express.compress()); // compress responses
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(expressValidator);
  app.use(express.cookieParser('__RequestValidationToken'));
  app.use(express.cookieSession({
    key: '__RequestValidationToken',
    secret: 'apeSystems_$&$_Beginnings',
    cookie: {httpOnly: true, expires: 0, path: '/'}
  }));
  // cache every file going out
  app.use(function(req, res, next) {
    if (!res.getHeader('Cache-Control')) {
      res.setHeader('Cache-Control', 'public, max-age=' + (86400 / 1000));
    }
    next();
  });

  //Dan entered the following to enable POST data parsing - Express Web App Dev, page 166
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: '/public/uploads'
  }));


  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});

// app.locals
app.locals({
  title: 'APE Systems',
  pretty: true // enabled during development for ease in troubleshooting
});

routes(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
