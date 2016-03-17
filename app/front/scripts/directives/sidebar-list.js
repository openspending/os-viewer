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
        title: '@'
      }
    };
  });
})(angular);
