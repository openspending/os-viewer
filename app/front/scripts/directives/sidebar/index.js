'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sidebar', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
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

            var x = Configuration.maxDimensionValuesForColumns;
            $scope.columnsHierarchies = _.chain(items)
              .map(function(hierarchy) {
                var result = _.extend({}, hierarchy);
                result.dimensions = _.filter(hierarchy.dimensions,
                  function(dimension) {
                    return dimension.values.length <= x;
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

          function isSelectionValid(selection, hierarchies, bypassFlag) {
            if (!bypassFlag && selection && selection.isDirty) {
              return false;
            }

            var allowedKeys = [];
            _.forEach(hierarchies, function(hierarchy) {
              _.forEach(hierarchy.dimensions, function(dimension) {
                allowedKeys.push(dimension.key);
              });
            });

            var result = true;
            _.forEach(selection, function(key) {
              if (allowedKeys.indexOf(key) < 0) {
                result = false;
                return false;
              }
            });

            return result;
          }

          function chooseColumnDimension(hierarchies) {
            var result = null;

            // Try to use datetime dimension
            _.forEach(hierarchies, function(hierarchy) {
              _.forEach(hierarchy.dimensions, function(dimension) {
                var isDateTime = dimension.dimensionType == 'datetime';
                var hasMultiValues = dimension.values.length > 1;
                if (isDateTime && hasMultiValues) {
                  result = dimension;
                  return false;
                }
              });
              if (result) {
                return false;
              }
            });
            if (result) {
              return result;
            }

            // Find dimension with at most X values
            var x = Configuration.maxDimensionValuesForColumns;
            _.forEach(hierarchies, function(hierarchy) {
              _.forEach(hierarchy.dimensions, function(dimension) {
                var isDateTime = dimension.dimensionType == 'datetime';
                var hasAtMostValues = dimension.values.length <= x;
                if (!isDateTime && hasAtMostValues) {
                  result = dimension;
                  return false;
                }
              });
              if (result) {
                return false;
              }
            });
            if (result) {
              return result;
            }

            // Choose any
            var hierarchy = _.first(hierarchies);
            if (hierarchy && hierarchy.dimensions) {
              result = _.first(hierarchy.dimensions);
            }
            return result;
          }

          function updateSelections(type) {
            if (!$scope.events || !type) {
              return;
            }

            var hierarchies = null;
            var dimension = null;

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

            if (!hierarchies) {
              return;
            }

            var isGroupValid = isSelectionValid(
              $scope.state.dimensions.current.groups, hierarchies);
            var isRowsValid = isSelectionValid(
              $scope.state.dimensions.current.rows, $scope.hierarchies);
            var isColumnsValid = isSelectionValid(
              $scope.state.dimensions.current.columns,
              $scope.columnsHierarchies, true);
            var isSeriesValid = isSelectionValid(
              $scope.state.dimensions.current.series, $scope.hierarchies);
            var isSeriesReallyValid = isSelectionValid(
              $scope.state.dimensions.current.series, $scope.hierarchies, true);
            var isSeriesEmpty =
              !_.isArray($scope.state.dimensions.current.series) ||
              ($scope.state.dimensions.current.series.length == 0);

            var hierarchy = _.first(hierarchies);
            if (hierarchy && hierarchy.dimensions) {
              dimension = _.first(hierarchy.dimensions);
              if (dimension) {
                if (!isGroupValid) {
                  $scope.events.changeGroup(dimension.key, true);
                }
              }
            }

            if (!isRowsValid) {
              $scope.events.changePivot('rows', dimension.key, true);
            }
            if (!isColumnsValid) {
              dimension = chooseColumnDimension($scope.columnsHierarchies);
              $scope.events.changePivot('columns', dimension.key, true);
              $scope.state.dimensions.current.columns.isDirty = false;
            }

            if (!isSeriesValid) {
              if (type == 'time-series') {
                if (!isSeriesReallyValid || isSeriesEmpty) {
                  $scope.events.changePivot('series', dimension.key, true);
                }
              } else {
                if (!isSeriesReallyValid) {
                  $scope.events.dropPivot('series', null, true);
                }
              }
              if ($scope.state.dimensions.current.series) {
                $scope.state.dimensions.current.series.isDirty = false;
              }
            }

            if (type == 'time-series') {
              $scope.events.toggleOrderBy(dimension.key, 'asc', true);
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
                    if (key == 'group') {
                      $scope.events.changeGroup(item.key, true);
                      var measure = $scope.state.measures.current;
                      $scope.events.toggleOrderBy(measure, 'asc', true);
                    } else {
                      if (isSelected) {
                        $scope.events.changePivot(key, item.key, true);
                      } else {
                        $scope.events.dropPivot(key, item.key, true);
                      }
                    }
                    break;
                  case 'time-series':
                    $scope.events.changePivot('series', item.key, true);
                    break;
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
