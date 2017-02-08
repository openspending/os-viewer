'use strict';

var ngModule = require('../../../module');

require('./visualization-share-popover');

ngModule.directive('visualizationContainer', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
      replace: true,
      restrict: 'E',
      scope: {
        visualization: '=',
        params: '='
      },
      link: function($scope) {
        $scope.removeVisualization = function(visualizationId) {
          $scope.$emit(Configuration.events.visualizations.remove,
            visualizationId);
        };
        $scope.removeAllVisualizations = function() {
          $scope.$emit(Configuration.events.visualizations.removeAll);
        };
      }
    };
  }
]);
