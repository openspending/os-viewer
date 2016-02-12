;(function(angular) {
  var redux = require('redux/dist/redux.js');
  var ngRedux = require('ng-redux/dist/ng-redux.js');

  var customComponents = require('components');

  angular.module('Application', [
    'ngBabbage',
    'angular.filter',
    'ui.bootstrap',
    'hc.marked'
//    'ngRedux'
  ]);

  customComponents.babbageGeoView(angular.module('ngBabbage'));

})(angular);
