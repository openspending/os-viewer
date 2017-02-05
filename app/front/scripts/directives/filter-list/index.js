'use strict';

var ngModule = require('../../module');

ngModule.directive('filterList', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        params: '=',
        filters: '='
      },
      link: function($scope) {
        $scope.clearFilter = function(key) {
          $scope.$emit(Configuration.events.sidebar.clearFilter, key);
        };
      }
    };
  }
]);
