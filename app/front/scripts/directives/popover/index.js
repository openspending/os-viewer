'use strict';

var angular = require('angular');

angular.module('Application')
  .directive('popover', [
    '$compile',
    function($compile) {
      return {
        template: '',
        replace: false,
        restrict: 'A',
        scope: false,
        link: function($scope, element, attrs) {
          element.popover({
            placement: 'left',
            html: true,
            content: function() {
              return $compile($(attrs.popover).html())($scope);
            }
          });
        }
      };
    }
  ]);
