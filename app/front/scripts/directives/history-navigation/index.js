'use strict';

var ngModule = require('../../module');

ngModule.directive('historyNavigation', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        history: '='
      },
      link: function($scope) {
        $scope.back = function() {
          $scope.$emit(Configuration.events.history.back);
        };
        $scope.forward = function() {
          $scope.$emit(Configuration.events.history.forward);
        };
      }
    };
  }
]);
