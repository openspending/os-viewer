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
        },
        link: function($scope) {
          $scope.$on('sidebarList.changeItemSelection',
            function($event, item, isSelected) {
              if ($scope.events) {
                $scope.events.changeMeasure(item.key);
              }
              $event.stopPropagation();
            });
        }
      };
    }
  ]);
})(angular);
