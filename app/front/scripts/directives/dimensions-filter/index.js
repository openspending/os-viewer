'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('dimensionsFilter', [
    function() {
      return {
        template: template,
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
              item.filter = filter.key;
            });
            return filter.values;
          };
          $scope.$on('sidebarList.changeItemSelection',
            function($event, item, isSelected) {
              if ($scope.events) {
                if (isSelected) {
                  $scope.events.changeFilter(item.filter, item.key);
                } else {
                  $scope.events.dropFilter(item.filter);
                }
              }
              $event.stopPropagation();
            });
        }
      };
    }
  ]);
