;(function(angular) {

  var app = angular.module('Application');

  app.directive('dimensions', function() {
    var directiveDefinitionObject = {
      templateUrl: 'templates/dimensions.html',
      replace: true,
      transclude: false,
      restrict: 'E',
      scope: {
        hierarchy: '=',
        dimensions: '=',
        events: '='
      }
    };
    return directiveDefinitionObject;
  });
})(angular);
