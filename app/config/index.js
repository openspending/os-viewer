'use strict';

var path = require('path');
var nconf = require('nconf');

nconf.file({
  file: path.join(__dirname, '/../../settings.json')
});

var apiHost = process.env.OS_VIEWER_API_HOST || 's145.okserver.org';

// this is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG || false,
  app: {
    port: process.env.PORT || 5000
  },
  api: {
    url: 'http://'+apiHost+'/api/3'
  },
  basePath: process.env.OS_VIEWER_BASE_PATH || ''
});

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};
