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
          $scope.getHierarchyName = function(hierarchy) {
            if (!hierarchy) {
              return;
            }
            return hierarchy.common ? 'Other Dimensions' : hierarchy.name;
          };

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

            $scope.datetimeHierarchies = _.chain(items)
              .map(function(hierarchy) {
                var result = _.extend({}, hierarchy);
                result.dimensions = _.filter(hierarchy.dimensions,
                  function(item) {
                    return item.dimensionType == 'datetime';
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
            _.forEach($scope.state.dimensions.items, function(dimension) {
              var isSelected = !!_.find(currentGroups, function(group) {
                return dimension.key == group;
              });
              if (isSelected) {
                result.push(dimension.hierarchy);
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

          function updateSelections(type) {
            if (!$scope.events) {
              return;
            }
            var hierarchies = null;
            if (type) {
              switch (type) {
                case 'location':
                  hierarchies = $scope.locationHierarchies;
                  break;
                case 'time-series':
                  hierarchies = $scope.datetimeHierarchies;
                  break;
                default:
                  hierarchies = $scope.hierarchies;
                  break;
              }
            }
            var hierarchy = _.first(hierarchies);
            if (hierarchy && hierarchy.dimensions) {
              var dimension = _.first(hierarchy.dimensions);
              if (dimension) {
                $scope.events.changeGroup(dimension.key, true);
                $scope.events.changePivot('rows', dimension.key, true);
                $scope.events.changePivot('columns', dimension.key, true);
              }
            }
          }
          updateSelections($scope.type);
          $scope.$watch('type', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              updateSelections($scope.type);
            }
          });

          $scope.$watchCollection('state.dimensions.current.groups',
            function(currentGroups) {
              updateSelectedHierarchies(currentGroups);
            });

          $scope.$on('sidebarList.changeItemSelection',
            function($event, item, isSelected, key) {
              if ($scope.events) {
                switch ($scope.type) {
                  case 'drilldown':
                    var dimension = _.first(item.dimensions);
                    if (dimension) {
                      $scope.events.changeGroup(dimension.key, true);
                    }
                    break;
                  case 'pivot-table':
                    if (isSelected) {
                      $scope.events.changePivot(key, item.key);
                    } else {
                      $scope.events.dropPivot(key, item.key);
                    }
                    break;
                  case 'sortable-series':
                  case 'time-series':
                  case 'location':
                    $scope.events.changeGroup(item.key, true);
                    break;
                }
              }
              $event.stopPropagation();
            });
        }
      };
    }
  ]);
})(angular);
