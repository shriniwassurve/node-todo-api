var env = process.env.NODE_ENV || 'development';

if (env ==='development' ||env ==='test') {
  var  config  = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// changed localhost to 127.0.0.1 in order  to reduce lookup time caused for localhost to be chaged to 127.0.0.1
// Read more: https://hackernoon.com/how-changing-localhost-to-127-0-0-1-sped-up-my-test-suite-by-1-800-8143ce770736
