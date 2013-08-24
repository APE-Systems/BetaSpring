var port = process.env.VAP_APP_PORT || 3000;

module.exports = {
      development: {
          port: port,
          mongodb: {
            hostname: 'localhost',
            port:  27017,
            db: 'ape'
          }
      },
      production: {
          mongodb: (process.env.VCAP_SERVICES) ? JSON.parse(process.env.VCAP_SERVICES)['mongodb-1.8'][0].credentials : ""
      },
      testing: {}
};
