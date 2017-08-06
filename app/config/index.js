'use strict';

var path = require('path');
var nconf = require('nconf');

var DEFAULT_HOST = 'https://openspending.org';
var DEFAULT_BASE_PATH = '';

nconf.file({
  file: path.join(__dirname, '/../../settings.json')
});

var apiHost = process.env.OS_VIEWER_API_HOST || DEFAULT_HOST;
var authHost = process.env.OS_VIEWER_AUTH_HOST || DEFAULT_HOST;
var searchHost = process.env.OS_VIEWER_SEARCH_HOST || DEFAULT_HOST;
var dataMineHost = process.env.OS_VIEWER_DATAMINE_HOST || DEFAULT_HOST;

var cosmopolitanHost = process.env.OS_VIEWER_API_COSMO_HOST ||
  '//cosmopolitan.openspending.org/v1/';

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
    url: searchHost + '/search/package'
  },
  dataMine: {
    url: dataMineHost
  },
  osExplorerUrl: process.env.OS_EXPLORER_URL || DEFAULT_HOST + '/',
  authLibraryUrl: authHost + '/user/lib',
  basePath: process.env.OS_VIEWER_BASE_PATH || DEFAULT_BASE_PATH,
  snippets: {
    ga: process.env.OS_SNIPPETS_GA || null
  }
});

module.exports = {
  get: nconf.get.bind(nconf),
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};
