/**
 * Created by Ihor Borysyuk on 22.01.16.
 */
;(function(angular) {

  var app = angular.module('Application');

  app.directive('selectedFilters', function() {
    var directiveDefinitionObject = {
      templateUrl: 'templates/selected-filters.html',
      replace: true,
      transclude: false,
      restrict: 'E',
      scope: {
        dimensions: '=',
        events: '='
      },
      link: function postLink(scope, iElement, iAttrs) {
      }
    };
    return directiveDefinitionObject;
  });
})(angular);
