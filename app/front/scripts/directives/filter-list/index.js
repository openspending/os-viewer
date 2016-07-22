'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('filterList', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          filters: '='
        },
        link: function($scope) {
          $scope.clearFilter = function(key) {
            $scope.$emit(Configuration.events.sidebar.clearFilter, key);
          };
        }
      };
    }
  ]);
