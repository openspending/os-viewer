'use strict';

var ngModule = require('../../../module');
var downloader = require('../../../services/downloader');
var visualizationsService = require('../../../services/visualizations');

ngModule.directive('lineChartVisualization', [
  '$timeout', 'i18n', 'Configuration',
  function($timeout, i18n, Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        params: '='
      },
      link: function($scope) {
        $scope.downloader = downloader;
        $scope.isVisible = true;
        $scope.state = visualizationsService
          .paramsToBabbageStateTimeSeries($scope.params);

        $scope.formatValue = Configuration.formatValue;
        $scope.messages = visualizationsService.getBabbageUIMessages(i18n);

        $scope.$watch('params', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.state = visualizationsService
              .paramsToBabbageStateTimeSeries($scope.params);
            $scope.isVisible = false;
            $timeout(function() {
              $scope.isVisible = true;
            });
          }
        }, true);

        $scope.$on('babbage-ui.ready', function() {
          Configuration.sealerHook(200); // Wait for rendering
        });
      }
    };
  }
]);
