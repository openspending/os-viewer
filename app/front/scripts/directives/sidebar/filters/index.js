'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sidebarFilters', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          hierarchies: '=',
          params: '='
        },
        link: function($scope) {
          $scope.$watchCollection('params.groups', function() {
            var groups = $scope.params.groups;
            if (!_.isArray(groups)) {
              groups = [];
            }

            $scope.selectedHierarchies = _.chain($scope.hierarchies)
              .filter(function(hierarchy) {
                return !!_.find(hierarchy.dimensions, function(dimension) {
                  return groups.indexOf(dimension.key) >= 0;
                });
              })
              .map(function(hierarchy) {
                return hierarchy.key;
              })
              .value();
          });

          $scope.$on(Configuration.events.sidebar.listItemChange,
            function($event, item, isSelected, listKey) {
              $event.stopPropagation();
              if (isSelected) {
                $scope.$emit(Configuration.events.sidebar.setFilter,
                  listKey, item.key);
              } else {
                $scope.$emit(Configuration.events.sidebar.clearFilter,
                  listKey);
              }
            });
        }
      };
    }
  ]);
