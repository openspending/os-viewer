;(function(angular) {

  var app = angular.module('Application');

  app.directive('popover', [
    '$compile',
    function($compile) {
      return {
        template: '',
        replace: false,
        restrict: 'A',
        scope: false,
        link: function($scope, element, attrs) {
          element.popover({
            placement: 'left',
            html: true,
            content: function() {
              return $compile($(attrs.popover).html())($scope);
            }
          });
        }
      };
    }
  ]);
})(angular);
