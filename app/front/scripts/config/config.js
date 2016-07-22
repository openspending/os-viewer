'use strict';

var angular = require('angular');

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
    '$rootScope',
    function($rootScope) {
      $rootScope.isLoading = {
        application: true
      };
    }
  ]);
