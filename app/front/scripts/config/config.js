;(function(angular) {

  var _ = require('underscore');

  angular.module('Application')
    .constant('_', _)
    .config([
      '$httpProvider', '$compileProvider', '$logProvider',
//      '$ngReduxProvider',
      function($httpProvider, $compileProvider, $logProvider /*,$ngReduxProvider*/) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = false;
        $logProvider.debugEnabled(true);

//        var reducer = combineReducers(reducers);
      }
    ]);

})(angular);
