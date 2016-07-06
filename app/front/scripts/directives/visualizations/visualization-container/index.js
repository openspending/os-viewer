'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('visualizationContainer', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
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
          $scope.showShareModal = function(visualization) {
            $scope.$emit(Configuration.events.visualizations.showShareModal,
              visualization);
          };
        }
      };
    }
  ]);
