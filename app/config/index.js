'use strict';

var path = require('path');
var nconf = require('nconf');

nconf.file({
  file: path.join(__dirname, '/../../settings.json')
});

var apiHost = process.env.OS_VIEWER_API_HOST || 'http://s145.okserver.org';
var authHost = process.env.OS_VIEWER_AUTH_HOST || 'http://s145.okserver.org';

var cosmopolitanHost = process.env.OS_VIEWER_AUTH_HOST || 'http://cosmopolitan.openspending.org/v1/';

// this is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG || false,
  app: {
    port: process.env.PORT || 5000
  },
  api: {
    url: apiHost + '/api/3',
    cosmoUrl: cosmopolitanHost
  },
  authLibraryUrl: authHost + '/permit/lib',
  basePath: process.env.OS_VIEWER_BASE_PATH || ''
});

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};
