;(function(angular) {

  var app = angular.module('Application');

  app.directive('sidebarList', function() {
    return {
      templateUrl: 'templates/sidebar-list.html',
      replace: true,
      transclude: false,
      restrict: 'E',
      scope: {
        items: '=',
        selected: '=',
        title: '@',
        canClear: '@?'
      },
      link: function($scope) {
        $scope.selectItem = function($event, item) {
          $scope.$emit('sidebarList.changeItemSelection', item, true);
          $event.stopPropagation();
        };
        $scope.unselectItem = function($event, item) {
          $scope.$emit('sidebarList.changeItemSelection', item, false);
          $event.stopPropagation();
        };
      }
    };
  });
})(angular);
