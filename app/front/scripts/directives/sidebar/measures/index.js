'use strict';

var ngModule = require('../../../module');

ngModule.directive('sidebarMeasures', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
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
