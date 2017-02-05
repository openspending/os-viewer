'use strict';

var _ = require('lodash');
var ngModule = require('../../../module');

ngModule.directive('drilldownSidebar', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        params: '=',
        hierarchies: '='
      },
      link: function($scope) {
        $scope.$watchCollection('params.groups', function() {
          var groups = $scope.params.groups;
          if (!_.isArray(groups)) {
            groups = [];
          }

          $scope.selectedHierarchies = _.chain($scope.hierarchies)
            .filter(function(hierarchy) {
              return !!_.find(hierarchy.dimensions, function(dimension) {
                return groups.indexOf(dimension.key) >= 0;
              });
            })
            .map(function(hierarchy) {
              return hierarchy.key;
            })
            .value();
        });

        $scope.$on(Configuration.events.sidebar.listItemChange,
          function($event, item, isSelected, listKey) {
            $event.stopPropagation();
            $scope.$emit(Configuration.events.sidebar.changeDimension,
              listKey, _.first(item.dimensions).key);
          });
      }
    };
  }
]);
