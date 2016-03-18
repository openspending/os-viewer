;(function(angular) {

  var app = angular.module('Application');

  app.directive('availablePackages', [
    '$window', '$timeout',
    function($window, $timeout) {
      return {
        templateUrl: 'templates/available-packages.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          events: '='
        },
        link: function($scope, element) {
          $scope.dropdownState = {};

          var block = element.find('.pinned');
          var list = element.find('ul');
          if (block.length > 0) {
            list.on('scroll', function() {
              var block = element.find('.pinned');
              block.css('top', list.get(0).scrollTop + 'px');
            });
          }

          var closeDropdownHandler = function(event) {
            if (!$(event.target).parents('.x-available-packages').length) {
              $timeout(function() {
                $scope.dropdownState.isOpen = false;
              });
            }
          };

          $window.addEventListener('click', closeDropdownHandler);

          $scope.$on('$destroy', function() {
            $window.removeEventListener('click', closeDropdownHandler);
          });
        }
      };
    }
  ]);
})(angular);
