'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sortingControl', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '='
        },
        link: function($scope) {
          $scope.toggleOrderBy = function(key) {
            var direction = 'desc';
            if ($scope.selected) {
              if ($scope.selected.key == key) {
                direction = ('' + $scope.selected.direction).toLowerCase();
                direction = (direction == 'desc') ? 'asc' : 'desc';
              }
            }
            $scope.$emit(Configuration.events.visualizations.changeOrderBy,
              key, direction);
          };
        }
      };
    }
  ]);
