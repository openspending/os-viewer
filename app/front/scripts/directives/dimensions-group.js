;(function(angular) {

  var app = angular.module('Application');

  app.directive('dimensionsGroup', function() {
    return {
      templateUrl: 'templates/dimensions-group.html',
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
