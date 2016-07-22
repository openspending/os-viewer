'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('timeSeriesSidebar', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          hierarchies: '=',
          params: '='
        },
        link: function($scope) {
          $scope.$on(Configuration.events.sidebar.listItemChange,
            function($event, item, isSelected, listKey) {
              $event.stopPropagation();
              $scope.$emit(Configuration.events.sidebar.changeDimension,
                listKey, item.key);
            });
        }
      };
    }
  ]);
