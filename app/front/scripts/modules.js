/**
 * Import some modules - required for other stuff like Bootstrap and Angular
 */
(function(globals, require) {
  globals.$ = globals.jQuery = require('jquery');
  globals.d3 = require('d3');
  globals.c3 = require('c3');
  globals.Raphael = require('raphael');
  require('isomorphic-fetch/fetch-npm-browserify'); // fetch() polyfill
})(window, require);
