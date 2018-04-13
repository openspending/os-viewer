'use strict';

var path = require('path');
var nconf = require('nconf');

var DEFAULT_HOST = process.env.OS_BASE_URL;
var DEFAULT_BASE_PATH = '';

nconf.file({
  file: path.join(__dirname, '/../../settings.json')
});

var conductorUrl = process.env.OS_CONDUCTOR_URL || DEFAULT_HOST;
var apiHost = process.env.OS_API_URL || DEFAULT_HOST;
var authHost = conductorUrl;
var searchHost = conductorUrl + '/search/package';
var dataMineHost = process.env.OS_VIEWER_DATAMINE_HOST || DEFAULT_HOST;
var cosmopolitanHost = process.env.OS_VIEWER_API_COSMO_HOST;

// this is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG || false,
  app: {
    port: process.env.PORT || 4000
  },
  api: {
    url: apiHost + '/api/3',
    cosmoUrl: cosmopolitanHost
  },
  search: {
    url: searchHost
  },
  dataMine: {
    url: dataMineHost
  },
  osExplorerUrl: process.env.OS_EXPLORER_URL || DEFAULT_HOST + '/',
  osConductorUrl: conductorUrl + '/',
  authLibraryUrl: authHost + '/user/lib',
  basePath: process.env.OS_VIEWER_BASE_PATH || DEFAULT_BASE_PATH,
  snippets: {
    ga: process.env.OS_SNIPPETS_GA || null,
    raven: process.env.OS_SNIPPETS_RAVEN || null
  },
  sentryDSN: process.env.SENTRY_DSN || null
});

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};
