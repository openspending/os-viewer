;(function(angular) {

  var customComponents = require('components');

  angular.module('Application', [
    'ngAnimate',
    'ngBabbage',
    'angular.filter',
    'hc.marked',
    'authClient.services'
  ]);

  customComponents.babbageGeoView(angular.module('ngBabbage'));

})(angular);
