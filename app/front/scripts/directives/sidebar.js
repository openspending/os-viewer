;(function(angular) {

  var app = angular.module('Application');

  app.directive('sidebar', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/sidebar.html',
        replace: false,
        restrict: 'E',
        scope: {
          type: '@',
          state: '=',
          events: '='
        },
        link: function($scope) {
          $scope.$watchCollection('state.hierarchies', function(items) {
            $scope.hierarchies = _.filter(items, function(item) {
              return !item.common;
            });
          });

          $scope.$watchCollection('state.dimensions.current.groups',
            function(currentGroups) {
              var result = [];
              _.each($scope.state.dimensions.items, function(dimension) {
                var isSelected = !!_.find(currentGroups, function(group) {
                  return dimension.key == group;
                });
                if (isSelected) {
                  result.push(dimension.hierarchy);
                }
              });
              $scope.selectedHierarchies = result;
            });

          $scope.$on('sidebarList.changeItemSelection',
            function($event, item, isSelected) {
              if ($scope.events) {
                if ($scope.type == 'drilldown') {
                  var dimension = _.first(item.dimensions);
                  if (dimension) {
                    $scope.events.changeGroup(dimension.key, true);
                  }
                }
              }
              $event.stopPropagation();
            });
        }
      };
    }
  ]);
})(angular);
