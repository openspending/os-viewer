'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sidebarPlainList', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          canClear: '@?',
          key: '@?'
        },
        link: function($scope) {
          $scope.isSelected = function(key) {
            return !_.isUndefined(_.find($scope.selected, function(item) {
              return item == key;
            }));
          };

          $scope.selectedItems = [];

          $scope.selectItem = function($event, item) {
            $scope.$emit(Configuration.events.sidebar.listItemChange,
              item, true, $scope.key);
            $event.stopPropagation();
          };
          $scope.unselectItem = function($event, item) {
            $scope.$emit(Configuration.events.sidebar.listItemChange,
              item, false, $scope.key);
            $event.stopPropagation();
          };
        }
      };
    }
  ]);
