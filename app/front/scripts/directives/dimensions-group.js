;(function(angular) {

  var app = angular.module('Application');

  app.directive('dimensionsGroup', function() {
    return {
      templateUrl: 'templates/dimensions-group.html',
      replace: true,
      restrict: 'E',
      scope: {
        hierarchy: '=',
        dimensions: '=',
        events: '=',
        title: '@?'
      },
      link: function($scope) {
        $scope.$on('sidebarList.changeItemSelection',
          function($event, item, isSelected) {
            if ($scope.events) {
              $scope.events.changeGroup(item.key);
            }
            $event.stopPropagation();
          });
      }
    };
  });
})(angular);
