/**
 * Created by user on 22.01.16.
 */
;(function(angular) {

  var app = angular.module('Application');

  app.directive('dropdown', [
    '$timeout',
    function($timeout) {
      return {
        templateUrl: '/templates/dropdown.html',
        replace: true,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          title: '@',
          onClick: '&'
        },
        link: function(scope, element, attrs) {
          scope.onItemClick = function(item) {
            scope.selected = item;
            $timeout(function() {
              scope.onClick();
            });
          };
        }
      };
    }
  ]);
})(angular);
