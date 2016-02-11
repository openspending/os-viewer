;(function(angular) {

  var _ = require('underscore');

  angular.module('Application')
    .constant('_', _)
    .config([
      '$httpProvider', '$compileProvider', '$logProvider', '$locationProvider',
//      '$ngReduxProvider',
      function($httpProvider, $compileProvider, $logProvider, $locationProvider /*,$ngReduxProvider*/) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = false;
        $logProvider.debugEnabled(true);

        $locationProvider.html5Mode(true);

//        var reducer = combineReducers(reducers);
      }
    ]);

})(angular);
