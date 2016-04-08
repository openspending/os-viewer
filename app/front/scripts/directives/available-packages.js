;(function(angular) {

  var app = angular.module('Application');

  app.directive('availablePackages', [
    '$window', '$timeout', '$rootScope',
    function($window, $timeout, $rootScope) {
      return {
        templateUrl: 'templates/available-packages.html',
        replace: true,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          events: '='
        },
        link: function($scope, element) {
          $scope.dropdownState = {};
          $scope.isEmbedded = $rootScope.isEmbedded;

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
