'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sortingControl', [
    function() {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          events: '='
        },
        link: function($scope) {
        }
      };
    }
  ]);
