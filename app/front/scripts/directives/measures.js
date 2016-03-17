;(function(angular) {

  var app = angular.module('Application');

  app.directive('measures', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/measures.html',
        replace: true,
        restrict: 'E',
        scope: {
          measures: '=',
          events: '='
        }
      };
    }
  ]);
})(angular);
