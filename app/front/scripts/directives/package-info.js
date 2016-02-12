;(function(angular) {

  angular.module('Application')
    .directive('packageInfo', function() {
      return {
        templateUrl: '/templates/package-info.html',
        replace: true,
        restrict: 'E',
        scope: {
          packageUrl: '@',
          resourceUrl: '@'
        }
      };
    });

})(angular);
