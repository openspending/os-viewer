'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('visualizationShareModal', [
    '$location', '$browser', 'Configuration',
    function($location, $browser, Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
        },
        link: function($scope, element) {
          var shareModal = element.find('.x-visualization-share-modal').modal({
            show: false
          });

          $scope.$on(Configuration.events.visualizations.showShareModal,
            function($event, visualization) {
              if (visualization && visualization.embed) {
                var base = $browser.baseHref();
                if (base.substr(0, 1) != '/') {
                  base = '/' + base;
                }
                if (base.substr(-1, 1) == '/') {
                  base = base.substr(0, base.length - 1);
                }

                var protocol = $location.protocol() + '://';
                var host = $location.host();
                var port = $location.port() == '80' ? '' :
                ':' + $location.port();
                var url = $location.url();

                $scope.shareUrl = protocol + host + port + base +
                  '/embed/' + visualization.embed + url;
                shareModal.modal('show');
              }
            });
        }
      };
    }
  ]);
