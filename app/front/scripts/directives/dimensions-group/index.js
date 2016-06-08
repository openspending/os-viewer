'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('dimensionsGroup', function() {
    return {
      template: template,
      replace: true,
      restrict: 'E',
      scope: {
        hierarchy: '=',
        dimensions: '=',
        events: '=',
        title: '@?'
      },
      link: function($scope) {
        $scope.$on('sidebarList.changeItemSelection',
          function($event, item, isSelected) {
            if ($scope.events) {
              $scope.events.changeGroup(item.key);
            }
            $event.stopPropagation();
          });
      }
    };
  });
