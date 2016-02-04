/**
 * Created by Ihor Borysyuk on 22.01.16.
 */
;(function(angular) {

  var app = angular.module('Application');

  app.directive('dimensionsGroup', function() {
    var directiveDefinitionObject = {
      templateUrl: '/templates/dimensions-group.html',
      replace: true,
      transclude: false,
      restrict: 'E',
      scope: {
        dimensions: '='
      }
    };
    return directiveDefinitionObject;
  });
})(angular);
