;(function(angular) {

  var app = angular.module('Application');

  app.directive('measures', function() {
    var directiveDefinitionObject = {
      templateUrl: 'templates/measures.html',
      replace: true,
      transclude: false,
      restrict: 'E',
      scope: {
        measures: '=',
        events: '='
      }
    };
    return directiveDefinitionObject;
  });
})(angular);
