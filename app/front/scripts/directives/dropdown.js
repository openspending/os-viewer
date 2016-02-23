/**
 * Created by Ihor Borysyuk on 22.01.16.
 */
;(function(angular) {

  var app = angular.module('Application');

  app.directive('dropdown', [
    '$timeout', '_',
    function($timeout, _) {
      return {
        templateUrl: 'templates/dropdown.html',
        replace: true,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          title: '@',
          allowSearch: '=',
          alignment: '@',
          onClick: '&'
        },
        link: function(scope, element, attrs) {
          scope.state = {
            isOpen: false
          };
          scope.onItemClick = function(item) {
            scope.selected = item;
            scope.state.isOpen = false;
            $timeout(function() {
              scope.onClick();
            });
          };

          scope.$watchCollection('items', function(values) {
            var size = 0;
            _.each(values, function(node) {
              var len = ('' + node.value).length;
              if (len > size) {
                size = len;
              }
            });
            if (size > 50) {
              size = Math.ceil(size * 0.5);
            } else
            if (size > 20) {
              size = Math.ceil(size * 0.7);
            }
            element.find('ul').css('min-width', size + 'em');

            scope.preparedItems = _.map(values, function(node) {
              return {
                key: node.key,
                value: node.value
              };
            });
          });

          scope.$watch('allowSearch', function() {
            $timeout(function() {
              var list = element.find('ul');
              list.off('scroll');

              var block = element.find('.pinned');
              if (block.length > 0) {
                list.on('scroll', function() {
                  var block = element.find('.pinned');
                  block.css('top', list.get(0).scrollTop + 'px');
                });
              }
            });
          });
        }
      };
    }
  ]);
})(angular);
