'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('measures', [
    function() {
      return {
        template: template,
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
