'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('breadcrumbs', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: true,
        restrict: 'E',
        scope: {
          breadcrumbs: '='
        },
        link: function($scope) {
          $scope.breadcrumbClick = function(breadcrumb) {
            $scope.$emit(Configuration.events.visualizations.breadcrumbClick,
              breadcrumb);
          };
        }
      };
    }
  ]);
