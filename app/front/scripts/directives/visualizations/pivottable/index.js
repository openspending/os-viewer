'use strict';

var ngModule = require('../../../module');
var downloader = require('../../../services/downloader');
var visualizationsService = require('../../../services/visualizations');
var prettyTable = require('./pretty-table');

require('../controls/export');

ngModule.directive('pivotTableVisualization', [
  '$window', '$timeout', 'Configuration',
  function($window, $timeout, Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        params: '='
      },
      link: function($scope, element) {
        $scope.downloader = downloader;
        $scope.isVisible = true;
        $scope.state = visualizationsService
          .paramsToBabbageStatePivot($scope.params);

        var table = null;

        $scope.formatValue = Configuration.formatValue;
        $scope.$on('babbage-ui.table-ready', function() {
          table = prettyTable(element.find('.pivot-table').get(0));

          $timeout(function() {
            if (table) {
              table.update();
            }
          }, 50);
        });

        $scope.$watch('params', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.state = visualizationsService
              .paramsToBabbageStatePivot($scope.params);
            $scope.isVisible = false;
            $timeout(function() {
              $scope.isVisible = true;
            });
          }
        }, true);

        function resizeHandler() {
          if (table) {
            table.resize();
          }
        }

        $window.addEventListener('resize', resizeHandler);
        $scope.$on('$destroy', function() {
          table = null;
          $window.removeEventListener('resize', resizeHandler);
        });
      }
    };
  }
]);
