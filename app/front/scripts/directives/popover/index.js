'use strict';

var _ = require('lodash');
var angular = require('angular');

var popoverList = [];

angular.module('Application')
  .directive('popover', [
    '$templateRequest', '$compile',
    function($templateRequest, $compile) {
      return {
        template: '',
        replace: false,
        restrict: 'A',
        scope: false,
        link: function($scope, element, attrs) {
          var popoverScope = null;
          var popoverSrc = null;

          function showPopover() {
            element.popover('toggle');
          }

          function hidePopover() {
            element.popover('hide');
          }

          element.on('click', showPopover);

          element.on('show.bs.popover', function() {
            _.each(popoverList, function(hide) {
              if (hide !== hidePopover) {
                hide();
              }
            });
          });
          popoverList.push(hidePopover);

          function initPopover(src) {
            popoverSrc = src;
            $templateRequest(src, true).then(function(template) {
              if (src == popoverSrc) {
                if (popoverScope) {
                  popoverScope.$destroy();
                }
                popoverScope = $scope.$new();
                template = $compile(template)(popoverScope);
                element.popover('destroy');
                element.popover({
                  placement: 'left',
                  trigger: 'manual',
                  html: true,
                  content: function() {
                    return template;
                  }
                });
              }
            });
          }

          attrs.$observe('popover', function(value) {
            if (value != popoverSrc) {
              initPopover(value);
            }
          });

          initPopover(attrs.popover);

          $scope.$on('$destroy', function() {
            element.popover('destroy');
            popoverList = _.filter(popoverList, function(item) {
              return item !== hidePopover;
            });
            if (popoverScope) {
              popoverScope.$destroy();
            }
          });
        }
      };
    }
  ]);
