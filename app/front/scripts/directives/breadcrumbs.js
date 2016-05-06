;(function(angular) {

  var app = angular.module('Application');

  app.directive('breadcrumbs', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/breadcrumbs.html',
        replace: true,
        restrict: 'E',
        scope: {
          breadcrumbs: '=',
          events: '='
        },
        link: function($scope) {
        }
      };
    }
  ]);
})(angular);
