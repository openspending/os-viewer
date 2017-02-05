'use strict';

var ngModule = require('../../../module');

ngModule.directive('timeSeriesSidebar', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
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
