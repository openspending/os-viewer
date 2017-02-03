'use strict';

var angular = require('angular');

angular.module('Application')
  .directive('autoselect', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, element) {
          element.on('focus', function() {
            element.select();
          });
        }
      };
    }
  ]);
