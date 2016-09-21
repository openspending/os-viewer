'use strict';

var angular = require('angular');
var template = require('./template.html');
var downloader = require('../../../services/downloader');
var visualizationsService = require('../../../services/visualizations');

angular.module('Application')
  .directive('radarChartVisualization', [
    '$timeout',
    function($timeout) {
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
            .paramsToBabbageStatePivot($scope.params);

          $scope.$watch('params', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              $scope.state = visualizationsService
                .paramsToBabbageStatePivot($scope.params);
              $timeout(function() {
                $scope.isVisible = false;
                $timeout(function() {
                  $scope.isVisible = true;
                });
              });
            }
          }, true);
        }
      };
    }
  ]);
