'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('breadcrumbs', [
    function() {
      return {
        template: template,
        replace: true,
        restrict: 'E',
        scope: {
          breadcrumbs: '=',
          events: '='
        },
        link: function($scope) {
        }
      };
    }
  ]);
