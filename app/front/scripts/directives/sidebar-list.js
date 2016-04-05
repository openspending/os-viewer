;(function(angular) {

  var app = angular.module('Application');

  app.directive('sidebarList', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/sidebar-list.html',
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          title: '@',
          canClear: '@?',
          plainList: '@?',
          key: '@?'
        },
        link: function($scope) {
          $scope.isSelected = function(key) {
            return !_.isUndefined(_.find($scope.selected, function(item) {
              return item == key;
            }));
          };
          $scope.selectItem = function($event, item) {
            $scope.$emit('sidebarList.changeItemSelection',
              item, true, $scope.key);
            $event.stopPropagation();
          };
          $scope.unselectItem = function($event, item) {
            $scope.$emit('sidebarList.changeItemSelection',
              item, false, $scope.key);
            $event.stopPropagation();
          };
        }
      };
    }
  ]);
})(angular);
