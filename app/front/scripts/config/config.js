'use strict';

var angular = require('angular');
var i18n = require('../../../config/i18n');
var visualizations = require('../services/visualizations');

angular.module('Application')
  .config([
    '$httpProvider', '$compileProvider', '$logProvider', '$locationProvider',
    'markedProvider',
    function($httpProvider, $compileProvider, $logProvider, $locationProvider,
      markedProvider) {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|file|javascript):/);
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = false;
      $logProvider.debugEnabled(true);

      $locationProvider.html5Mode(true);

      markedProvider.setOptions({gfm: true});
    }
  ])
  .run([
    '$rootScope', '$location', 'Configuration',
    function($rootScope, $location, Configuration) {
      $rootScope.isLoading = {
        application: true
      };
      var lang = $location.search().lang;
      $rootScope._t = i18n.init(lang);

      // "Suffix": scale, "Suffix 2": scale2
      var scale = $rootScope._t('Value Formatting Scale');
      var formatValue = visualizations.formatValue(scale);
      $rootScope.formatValue = formatValue;
      Configuration.formatValue = formatValue;
    }
  ])
  .filter('i18n', ['$rootScope', function($rootScope) {
    return function(input) {
      return $rootScope._t(input);
    };
  }]);
