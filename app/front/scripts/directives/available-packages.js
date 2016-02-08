;(function(angular) {

  var app = angular.module('Application');

  app.directive('availablePackages', function() {
    var directiveDefinitionObject = {
      templateUrl: '/templates/available-packages.html',
      replace: true,
      transclude: false,
      restrict: 'E',
    };
    return directiveDefinitionObject;
  });
})(angular);
