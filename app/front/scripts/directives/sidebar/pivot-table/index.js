'use strict';

var ngModule = require('../../../module');

ngModule.directive('pivotTableSidebar', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        rowHierarchies: '=',
        columnHierarchies: '=',
        params: '='
      },
      link: function($scope) {
        $scope.$on(Configuration.events.sidebar.listItemChange,
          function($event, item, isSelected, listKey) {
            $event.stopPropagation();
            if (isSelected) {
              $scope.$emit(Configuration.events.sidebar.changeDimension,
                listKey, item.key);
            } else {
              $scope.$emit(Configuration.events.sidebar.clearDimension,
                listKey, item.key);
            }
          });
      }
    };
  }
]);
