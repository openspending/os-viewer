;(function(angular) {

  var app = angular.module('Application');

  app.directive('dimensionsFilter', function() {
    return {
      templateUrl: 'templates/dimensions-filter.html',
      replace: true,
      restrict: 'E',
      scope: {
        hierarchy: '=',
        dimensions: '=',
        events: '='
      }
    };
  });
})(angular);
