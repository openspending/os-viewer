'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sidebarMeasures', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          measures: '=',
          params: '='
        },
        link: function($scope) {
          $scope.$on(Configuration.events.sidebar.listItemChange,
            function($event, item, isSelected, listKey) {
              $event.stopPropagation();
              $scope.$emit(Configuration.events.sidebar.changeMeasure,
                item.key);
            });
        }
      };
    }
  ]);
