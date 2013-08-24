var mongoose = require( 'mongoose' )
  , env, ape, iw, lv, usc, tt, uvm;
  if (process.env.VCAP_SERVICES) {
    env = JSON.parse(process.env.VCAP_SERVICES);
    db1 = env['mongodb-1.8'][0].credentials;
    db2 = env['mongodb-1.8'][1].credentials;
    db3 = env['mongodb-1.8'][2].credentials;
    db4 = env['mongodb-1.8'][3].credentials;
    db5 = env['mongodb-1.8'][4].credentials;
    db6 = env['mongodb-1.8'][5].credentials;
    ape = mongoose.createConnection(db1.url);
    lv = mongoose.createConnection(db2.url);
    iw = mongoose.createConnection(db3.url);
    usc = mongoose.createConnection(db4.url);
    tt = mongoose.createConnection(db5.url);
    uvm = mongoose.createConnection(db6.url);
    console.log('connected to mongos');
  }
  else {
    var mongo = {
      ape: 'mongodb://localhost:27017/ape?safe=true',
      iw: 'mongodb://localhost:27017/IW?safe=true',
      lv: 'mongodb://localhost:27017/LV?safe=true',
      usc: 'mongodb://localhost:27017/USC?safe=true',
      tt: 'mongodb://localhost:27017/TT?safe=true',
      uvm: 'mongodb://localhost:27017/UVM?safe=true'
    };
    ape = mongoose.createConnection(mongo.ape),
    iw = mongoose.createConnection(mongo.iw);
    lv = mongoose.createConnection(mongo.lv);
    usc = mongoose.createConnection(mongo.usc);
    tt = mongoose.createConnection(mongo.tt);
    uvm = mongoose.createConnection(mongo.uvm);
    console.log('connected to Mongo@ localhost:27017/ape, localhost:27018/iw', 'localhost: 27019/lv, localhost:27020/usc, localhost:27021/tt, localhost:27022/uvm');
  }

// General Models
module.exports.Athletes = ape.model('athletes', require('./schemas/athletes'));
module.exports.Coaches = ape.model('coaches', require('./schemas/coaches'));
module.exports.Schools = ape.model('schools', require('./schemas/schools'));
module.exports.Sessions = ape.model('sessions', require('./schemas/sessions'));

module.exports.models = function(school) {
  var models = {};

  switch(school) {
    case "UniversityofLouisville":
      models.Metric = lv.model('metrics', require('./schemas/LV/metrics'));
      models.Biometric = lv.model('biometrics', require('./schemas/LV/bioMetrics'));
      models.Power = lv.model('powermetrics', require('./schemas/LV/power'));
      models.Speed = lv.model('speedmetrics', require('./schemas/LV/speed'));
      models.Strength = lv.model('strengthmetrics', require('./schemas/LV/strength'));
      models.RecordTime = lv.model('recordTimes', require('./schemas/LV/recordTime'));
      console.info("Models: University of Louisville");
      break;

    case "UniversityofIowa":
      models.Metric = iw.model('metrics', require('./schemas/IW/metrics'));
      models.Biometric = iw.model('biometrics', require('./schemas/IW/bioMetrics'));
      models.Power = iw.model('powermetrics', require('./schemas/IW/power'));
      models.Speed = iw.model('speedmetrics', require('./schemas/IW/speed'));
      models.Strength = iw.model('strengthmetrics', require('./schemas/IW/strength'));
      models.RecordTime = iw.model('recordTimes', require('./schemas/IW/recordTime'));
      console.info("Models: University of Iowa");
      break;

    case "UniversityofSouthernCalifornia":
      models.Metric = usc.model('metrics', require('./schemas/USC/metrics'));
      models.Biometric = usc.model('biometrics', require('./schemas/USC/bioMetrics'));
      models.Power = usc.model('powermetrics', require('./schemas/USC/power'));
      models.Speed = usc.model('speedmetrics', require('./schemas/USC/speed'));
      models.Strength = usc.model('strengthmetrics', require('./schemas/USC/strength'));
      models.Fms = usc.model('fmsmetrics', require('./schemas/USC/fms'));
      models.RecordTime = usc.model('recordTimes', require('./schemas/USC/recordTime'));
      console.info("Models: University of Southern California");
      break;

    case "TexasTechUniversity":
      models.Metric = tt.model('metrics', require('./schemas/TT/metrics'));
      models.Biometric = tt.model('biometrics', require('./schemas/TT/bioMetrics'));
      models.Power = tt.model('powermetrics', require('./schemas/TT/power'));
      models.Speed = tt.model('speedmetrics', require('./schemas/TT/speed'));
      models.Strength = tt.model('strengthmetrics', require('./schemas/TT/strength'));
      models.RecordTime = tt.model('recordTimes', require('./schemas/TT/recordTime'));
      console.info("Models: Texas Tech University");
      break;

    case "UniversityofVermont":
      models.Metric = uvm.model('metrics', require('./schemas/UVM/metrics'));
      models.Biometric = uvm.model('biometrics', require('./schemas/UVM/bioMetrics'));
      models.Power = uvm.model('powermetrics', require('./schemas/UVM/power'));
      models.Strength = uvm.model('strengthmetrics', require('./schemas/UVM/strength'));
      models.RecordTime = uvm.model('recordTimes', require('./schemas/UVM/recordTime'));
      console.info("Models: University of Vermont");
      break;

    default:
      console.log('global models not catching');
      break
  }
  return models;
};
