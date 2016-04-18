;(function(angular) {

  var app = angular.module('Application');

  app.directive('sortingControl', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/sorting-control.html',
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          events: '='
        },
        link: function($scope) {
        }
      };
    }
  ]);
})(angular);
