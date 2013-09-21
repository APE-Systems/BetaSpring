var express=require("express"),routes=require("./routes"),http=require("http"),path=require("path"),expressValidator=require("express-validator"),app=express();app.configure(function(){app.set("port",process.env.VCAP_APP_PORT||3e3);app.set("views",__dirname+"/views");app.set("view engine","jade");app.use(express.favicon(__dirname+"/public/_imgs/ape.ico"));app.use(express.logger("dev"));app.use(express.compress());app.use(express.bodyParser());app.use(express.methodOverride());app.use(expressValidator);app.use(express.cookieParser("__RequestValidationToken"));app.use(express.cookieSession({key:"__RequestValidationToken",secret:"apeSystems_$&$_Beginnings",cookie:{httpOnly:!0,expires:0,path:"/"}}));app.use(function(e,t,n){t.getHeader("Cache-Control")||t.setHeader("Cache-Control","public, max-age=86.4");n()});app.use(app.router);app.use(express.static(path.join(__dirname,"public")))});app.configure("development",function(){app.use(express.errorHandler({showStack:!0,dumpExceptions:!0}))});app.configure("production",function(){app.use(express.errorHandler({showStack:!0,dumpExceptions:!0}))});app.locals({title:"APE Systems",pretty:!0});routes(app);http.createServer(app).listen(app.get("port"),function(){console.log("Express server listening on port "+app.get("port"))});