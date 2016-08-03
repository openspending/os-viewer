'use strict';

var angular = require('angular');
var template = require('./template.html');
var visualizationsService = require('../../../services/visualizations');

require('../controls/breadcrumbs');

angular.module('Application')
  .directive('sankeyVisualization', [
    '$timeout', 'Configuration',
    function($timeout, Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          params: '='
        },
        link: function($scope) {
          $scope.isVisible = true;
          $scope.state = visualizationsService
            .paramsToBabbageStateSankey($scope.params);

          $scope.$watch('params', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              $scope.state = visualizationsService
                .paramsToBabbageStateSankey($scope.params);
              $timeout(function() {
                $scope.isVisible = false;
                $timeout(function() {
                  $scope.isVisible = true;
                });
              });
            }
          }, true);

          $scope.$on('sankey-click',
            function($event, sankeyComponent, info) {
              $event.stopPropagation();
              if (info.isLink) {
                $scope.$emit(Configuration.events.visualizations.drillDown,
                  info.source.key);
              }
            });
        }
      };
    }
  ]);
