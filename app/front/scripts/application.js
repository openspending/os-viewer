'use strict';

var angular = require('angular');
require('angular-marked');
require('angular-filter');
require('angular-animate');

angular.module('Application', [
  'ngAnimate',
  'hc.marked',
  'angular.filter',
  'authClient.services'
]);

require('./config');
require('./controllers');
require('./directives');
require('./animations');
require('./services');
