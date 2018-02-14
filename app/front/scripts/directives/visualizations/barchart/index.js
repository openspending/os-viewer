'use strict';

var ngModule = require('../../../module');
var downloader = require('../../../services/downloader');
var visualizationsService = require('../../../services/visualizations');

require('../controls/sorting');
require('../controls/breadcrumbs');

ngModule.directive('barChartVisualization', [
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
          .paramsToBabbageState($scope.params);

        $scope.formatValue = Configuration.formatValue;
        $scope.messages = visualizationsService.getBabbageUIMessages(i18n);

        $scope.$watch('params', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.state = visualizationsService
              .paramsToBabbageState($scope.params);
            $scope.isVisible = false;
            $timeout(function() {
              $scope.isVisible = true;
            });
          }
        }, true);

        $scope.$on('babbage-ui.click',
          function($event, component, item) {
            var categoryName = component.chart.category(item['index']);
            $event.stopPropagation();

            if (categoryName.toLowerCase() !== 'others') {
              $scope.$emit(
                Configuration.events.visualizations.drillDown,
                categoryName
              );
            }
          });

        $scope.$on('babbage-ui.ready', function() {
          Configuration.sealerHook(200); // Wait for rendering
        });

        $scope.$watch('state', function(newValue, oldValue) {
          if (newValue.series !== oldValue.series) {
            $scope.colorScale = getColorScale(newValue.series);
          }
        }, true);
        $scope.colorScale = getColorScale($scope.state.series);

        function getColorScale(series) {
          // We only want colors on grouped bars, which only happen if there are
          // series.
          var colorScale = Configuration.colorScales.constant();

          if (series !== undefined || series.length > 0) {
            colorScale = Configuration.colorScales.categorical();
          }

          return colorScale;
        }
      }
    };
  }
]);

