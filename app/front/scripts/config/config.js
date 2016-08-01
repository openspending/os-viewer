'use strict';

var angular = require('angular');
var i18n = require('../../../config/i18n');

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
    '$rootScope', '$location',
    function($rootScope, $location) {
      $rootScope.isLoading = {
        application: true
      };
      var lang = $location.search().lang;
      $rootScope._t = i18n.init(lang);
    }
  ])
  .filter('i18n', ['$rootScope', function($rootScope) {
    return function(input) {
      return $rootScope._t(input);
    }
  }]);

