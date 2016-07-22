'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('packageSelector', [
    '$window', '$timeout', 'Configuration',
    function($window, $timeout, Configuration) {
      return {
        template: template,
        replace: true,
        restrict: 'E',
        scope: {
          items: '=',
          datapackage: '='
        },
        link: function($scope, element) {
          $scope.dropdownState = {};

          $scope.changePackage = function(packageId) {
            $scope.$emit(Configuration.events.packageSelector.change,
              packageId);
          };

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
