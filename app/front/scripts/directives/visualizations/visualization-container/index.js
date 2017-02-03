'use strict';

var _ = require('lodash');
var $ = require('jquery');
var angular = require('angular');
var template = require('./template.html');
var osViewerService = require('../../../services/os-viewer');

angular.module('Application')
  .directive('visualizationContainer', [
    '$location', '$browser', 'Configuration',
    function($location, $browser, Configuration) {
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

          function getShareUrl(visualization) {
            if (visualization && visualization.embed) {
              return osViewerService.buildUrl($scope.params, {
                visualization: visualization.embed,
                protocol: $location.protocol(),
                host: $location.host(),
                port: $location.port(),
                base: $browser.baseHref()
              });
            }
          }

          $scope.shareUrl = getShareUrl($scope.visualization);
          $scope.$watch('visualization', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              $scope.shareUrl = getShareUrl($scope.visualization);
            }
          });

          $scope.copyToClipboard = function($event) {
            var input = $($($event.currentTarget).attr('data-target'));
            if ((input.length > 0) && _.isFunction(document.execCommand)) {
              input.select();
              try {
                document.execCommand('copy');
              } catch (e) {
              }
            }
          };
        }
      };
    }
  ]);
