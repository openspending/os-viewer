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
          function updateHierarchies(items) {
            $scope.hierarchies = _.filter(items, function(item) {
              return !item.common;
            });

            $scope.locationHierarchies = _.chain(items)
              .map(function(hierarchy) {
                var result = _.extend({}, hierarchy);
                result.dimensions = _.filter(hierarchy.dimensions,
                  function(item) {
                    return item.dimensionType == 'location';
                  });
                if (result.dimensions.length > 0) {
                  return result;
                }
              })
              .filter()
              .value();
          }

          if ($scope.state && $scope.state.hierarchies) {
            updateHierarchies($scope.state.hierarchies);
          }

          $scope.$watchCollection('state.hierarchies', function(items) {
            updateHierarchies(items);
          });

          function updateSelectedHierarchies(currentGroups) {
            var result = [];
            _.each($scope.state.dimensions.items, function(dimension) {
              var isSelected = !!_.find(currentGroups, function(group) {
                return dimension.key == group;
              });
              if (isSelected) {
                if (dimension.drillDown) {
                  result.push(dimension.hierarchy);
                } else {
                  result.push('withoutHierarchy');
                }
              }
            });
            $scope.selectedHierarchies = result;
          }

          if (
            $scope.state &&
            $scope.state.dimensions &&
            $scope.state.dimensions.current &&
            $scope.state.dimensions.current.groups
          ) {
            updateSelectedHierarchies($scope.state.dimensions.current.groups);
          }

          $scope.$watchCollection('state.dimensions.current.groups',
            function(currentGroups) {
              updateSelectedHierarchies(currentGroups);
            });

          $scope.$on('sidebarList.changeItemSelection',
            function($event, item, isSelected) {
              if ($scope.events) {
                switch ($scope.type) {
                  case 'drilldown':
                  {
                    var dimension = _.first(item.dimensions);
                    if (dimension) {
                      $scope.events.changeGroup(dimension.key, true);
                    }
                    break;
                  }
                  case 'location': {
                    $scope.events.changeGroup(item.key, true);
                    break;
                  }
                  case 'sortable-series': {
                    $scope.events.changeGroup(item.key, true);
                    break;
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
