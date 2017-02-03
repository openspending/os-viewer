'use strict';

var ngModule = require('../../../../module');

ngModule.directive('breadcrumbs', [
  'Configuration',
  function(Configuration) {
    return {
      template: require('./template.html'),
      replace: true,
      restrict: 'E',
      scope: {
        breadcrumbs: '='
      },
      link: function($scope) {
        $scope.breadcrumbClick = function(breadcrumb) {
          $scope.$emit(Configuration.events.visualizations.breadcrumbClick,
            breadcrumb);
        };
      }
    };
  }
]);
