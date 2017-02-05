'use strict';

var ngModule = require('../../../../module');

ngModule.directive('sortingControl', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
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
