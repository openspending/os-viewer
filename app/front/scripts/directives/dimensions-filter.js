;(function(angular) {

  var app = angular.module('Application');

  app.directive('dimensionsFilter', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/dimensions-filter.html',
        replace: true,
        restrict: 'E',
        scope: {
          hierarchy: '=',
          dimensions: '=',
          events: '='
        },
        link: function($scope) {
          $scope.getFilterItems = function(filter) {
            _.forEach(filter.values, function(item) {
              item.filter = filter.code;
            });
            return filter.values;
          };
          $scope.$on('sidebarList.changeItemSelection',
            function($event, item, isSelected) {
              if ($scope.events) {
                if (isSelected) {
                  $scope.events.changeFilter(item.filter, item.key);
                } else {
                  $scope.events.dropFilter(item.filter)
                }
              }
              $event.stopPropagation();
            });
        }
      };
    }
  ]);
})(angular);
