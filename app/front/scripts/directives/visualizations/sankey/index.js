'use strict';

var angular = require('angular');
var template = require('./template.html');
var downloader = require('../../../services/downloader');
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
          $scope.downloader = downloader;
          $scope.isVisible = true;
          $scope.state = visualizationsService
            .paramsToBabbageStateSankey($scope.params);

          $scope.formatValue = Configuration.formatValue;

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

          $scope.$on('babbage-ui.click',
            function($event, component, item) {
              $event.stopPropagation();
              if (item.isLink) {
                $scope.$emit(Configuration.events.visualizations.drillDown,
                  item.source.key);
              }
            });
        }
      };
    }
  ]);
