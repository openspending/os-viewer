'use strict';

require('js-polyfills/xhr');
require('isomorphic-fetch');

var _ = require('lodash');

// Init some global variables - needed for proper work of angular and
// some other 3rd-party libraries
(function(globals) {
  globals._ = _;

  var jquery = require('jquery');
  globals.jQuery = globals.$ = jquery;
  globals.d3 = require('d3');
  globals.c3 = require('c3');
  globals.Raphael = require('raphael');

  var angular = require('angular');
  globals.angular = angular;
  if (typeof globals.Promise != 'function') {
    globals.Promise = require('bluebird');
  }
  require('isomorphic-fetch/fetch-npm-browserify'); // fetch() polyfill
  require('file-saver/FileSaver.js'); // saveAs() polyfill
  require('os-bootstrap/dist/js/bootstrap');

  globals.addEventListener('load', function() {
    require('./application');
    angular.bootstrap(globals.document, ['Application']);
  });
})(window || this);
