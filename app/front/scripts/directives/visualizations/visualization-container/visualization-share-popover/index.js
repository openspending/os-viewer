'use strict';

var _ = require('lodash');
var $ = require('jquery');
var ngModule = require('../../../../module');
var osViewerService = require('../../../../services/os-viewer');

ngModule.directive('visualizationSharePopover', [
  '$location', '$browser',
  function($location, $browser) {
    return {
      template: require('./template.html'),
      replace: true,
      restrict: 'E',
      scope: {
        visualization: '=',
        params: '='
      },
      link: function($scope) {
        function getShareUrl() {
          if ($scope.visualization && $scope.visualization.embed) {
            return osViewerService.buildUrl($scope.params, {
              visualization: $scope.visualization.embed,
              protocol: $location.protocol(),
              host: $location.host(),
              port: $location.port(),
              base: $browser.baseHref()
            });
          }
        }

        function updateShareUrl() {
          var shareUrl = getShareUrl();

          $scope.shareUrl = $scope.shortShareUrl = shareUrl;
          osViewerService.getShortUrl(shareUrl)
            .then(function(shortUrl) {
              if ($scope.shareUrl == shareUrl) {
                $scope.shortShareUrl = shortUrl;
                $scope.$applyAsync();
              }
            });
        }

        updateShareUrl();
        $scope.$watch('visualization', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            updateShareUrl();
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
