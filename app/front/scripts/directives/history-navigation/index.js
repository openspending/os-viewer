'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('historyNavigation', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          history: '='
        },
        link: function($scope) {
          $scope.back = function() {
            $scope.$emit(Configuration.events.history.back);
          };
          $scope.forward = function() {
            $scope.$emit(Configuration.events.history.forward);
          };
        }
      };
    }
  ]);
